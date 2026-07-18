
-- Roles system
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-promote first signup to admin
CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

-- House config: single row, JSONB blob
CREATE TABLE public.house_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.house_config TO anon, authenticated;
GRANT UPDATE ON public.house_config TO authenticated;
GRANT ALL ON public.house_config TO service_role;
ALTER TABLE public.house_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read house config"
  ON public.house_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can update house config"
  ON public.house_config FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER house_config_updated_at
  BEFORE UPDATE ON public.house_config
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial content
INSERT INTO public.house_config (data) VALUES ('{
  "guest_name": "Luca",
  "host_name": "Mascia",
  "hero_image_url": "",
  "wifi": { "ssid": "WINDTRE-3D39D8", "password": "9fc8bu2kr9rcra8a" },
  "map": { "center_lat": 40.3515, "center_lng": 18.1750, "zoom": 10.2 },
  "hero": {
    "kicker_it": "Casa nel Salento", "kicker_en": "House in Salento",
    "subtitle_it": "Tutto ciò che ti serve per vivere il Salento con calma — Wi-Fi, mappa, manuale di casa e contatti utili.",
    "subtitle_en": "Everything you need to enjoy Salento at your own pace — Wi-Fi, map, house manual and useful contacts."
  },
  "contacts": [
    {"key":"host","number":"+39 3204488439","whatsapp":true,"emergency":false,"label_it":"Host","label_en":"Host","sub_it":"Mascia — la tua padrona di casa","sub_en":"Mascia — your host"},
    {"key":"emergency","number":"112","whatsapp":false,"emergency":true,"label_it":"Emergenze","label_en":"Emergency","sub_it":"Numero unico europeo","sub_en":"European emergency number"},
    {"key":"doctor","number":"0836 812361","whatsapp":false,"emergency":false,"label_it":"Guardia medica","label_en":"Medical guard","sub_it":"Assistenza medica notturna e festiva","sub_en":"Out-of-hours medical assistance"},
    {"key":"fire","number":"115","whatsapp":false,"emergency":true,"label_it":"Vigili del fuoco","label_en":"Fire brigade","sub_it":"In caso di incendio","sub_en":"In case of fire"}
  ],
  "spots": [
    {"id":"conad","category":"essenziali","type":"supermercato","maps_query":"Conad Lecce","lat":40.3580,"lng":18.1660,"name_it":"Conad","name_en":"Conad","desc_it":"Supermercato grande, aperto 7/7","desc_en":"Large supermarket, open 7 days"},
    {"id":"farmacia","category":"essenziali","type":"farmacia","maps_query":"Farmacia Lecce centro","lat":40.3528,"lng":18.1718,"name_it":"Farmacia centrale","name_en":"Central pharmacy","desc_it":"Turno notturno consultabile all''ingresso","desc_en":"Night duty listed at the entrance"},
    {"id":"leZie","category":"locali","type":"ristorante","maps_query":"Trattoria Le Zie Lecce","lat":40.3470,"lng":18.1810,"name_it":"Trattoria Le Zie","name_en":"Trattoria Le Zie","desc_it":"Cucina salentina autentica, prenota sempre","desc_en":"Authentic Salento cuisine — always book ahead"},
    {"id":"natale","category":"locali","type":"ristorante","maps_query":"Pasticceria Natale Lecce","lat":40.3534,"lng":18.1736,"name_it":"Pasticceria Natale","name_en":"Pasticceria Natale","desc_it":"Pasticciotto leccese la mattina, gelato d''estate","desc_en":"Pasticciotto in the morning, gelato in summer"},
    {"id":"pescoluse","category":"locali","type":"spiaggia","maps_query":"Pescoluse Maldive Salento","lat":39.8463,"lng":18.3438,"name_it":"Pescoluse — le Maldive","name_en":"Pescoluse — the Maldives","desc_it":"Sabbia bianca e acqua turchese, ~1h di auto","desc_en":"White sand, turquoise water, ~1h drive"},
    {"id":"baiaTurchi","category":"locali","type":"spiaggia","maps_query":"Baia dei Turchi Otranto","lat":40.1763,"lng":18.5083,"name_it":"Baia dei Turchi","name_en":"Baia dei Turchi","desc_it":"Pineta + cala selvaggia vicino Otranto","desc_en":"Pine forest and wild cove near Otranto"},
    {"id":"frantoio","category":"locali","type":"chicca","maps_query":"Frantoio ipogeo Salento","lat":40.1330,"lng":18.3500,"name_it":"Frantoio ipogeo","name_en":"Underground oil mill","desc_it":"Chicca segreta scavata nella pietra","desc_en":"Hidden gem carved into the stone"}
  ],
  "manual": [
    {"id":"trash","icon":"trash","title_it":"Raccolta differenziata","title_en":"Waste sorting","body_it":"Umido lun/mer/ven mattina. Plastica martedì. Carta giovedì. I bidoni sono sul retro.","body_en":"Organic Mon/Wed/Fri morning. Plastic Tue. Paper Thu. Bins are at the back."},
    {"id":"ac","icon":"snowflake","title_it":"Aria condizionata","title_en":"Air conditioning","body_it":"Telecomando sul tavolo. Consigliata 24°C. Chiudi finestre quando è accesa.","body_en":"Remote on the table. Recommended 24°C. Close windows when it is on."},
    {"id":"water","icon":"droplets","title_it":"Acqua","title_en":"Water","body_it":"L''acqua del rubinetto è potabile ma dal sapore forte — meglio in bottiglia per bere.","body_en":"Tap water is drinkable but hard — bottled water is better to drink."},
    {"id":"keys","icon":"key","title_it":"Chiavi","title_en":"Keys","body_it":"Due mazzi. Lascia sempre uno dentro casa quando esci.","body_en":"Two sets. Always leave one inside when you go out."},
    {"id":"checkout","icon":"clock","title_it":"Check-out","title_en":"Check-out","body_it":"Entro le 10:00. Lascia le chiavi sul tavolo della cucina.","body_en":"By 10:00. Leave the keys on the kitchen table."},
    {"id":"smoke","icon":"cigarette","title_it":"Fumo","title_en":"Smoking","body_it":"Vietato fumare all''interno. Sul terrazzo va bene, usa il posacenere.","body_en":"No smoking indoors. Terrace is fine, use the ashtray."},
    {"id":"pets","icon":"paw","title_it":"Animali","title_en":"Pets","body_it":"Benvenuti se puliti — mai sul letto o sul divano bianco, grazie.","body_en":"Welcome if clean — never on the bed or the white sofa, please."}
  ]
}'::jsonb);
