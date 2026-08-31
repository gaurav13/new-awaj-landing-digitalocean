--
-- PostgreSQL database dump
--

\restrict jrlgB27ZZYIDcgmze5EfFiT9eQY7ZXHAxBjOFup7NU0DeLXCWra02eQVPz0FBfs

-- Dumped from database version 17.11 (32e7196)
-- Dumped by pg_dump version 17.10 (Ubuntu 17.10-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA neon_auth;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" uuid NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    scope text,
    password text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: invitation; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.invitation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    email text NOT NULL,
    role text,
    status text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "inviterId" uuid NOT NULL
);


--
-- Name: jwks; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.jwks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "publicKey" text NOT NULL,
    "privateKey" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "expiresAt" timestamp with time zone
);


--
-- Name: member; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    role text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


--
-- Name: organization; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.organization (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text,
    "createdAt" timestamp with time zone NOT NULL,
    metadata text
);


--
-- Name: project_config; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.project_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    endpoint_id text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trusted_origins jsonb NOT NULL,
    social_providers jsonb NOT NULL,
    email_provider jsonb,
    email_and_password jsonb,
    allow_localhost boolean NOT NULL,
    plugin_configs jsonb,
    webhook_config jsonb
);


--
-- Name: session; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.session (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" uuid NOT NULL,
    "impersonatedBy" text,
    "activeOrganizationId" text
);


--
-- Name: user; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role text,
    banned boolean,
    "banReason" text,
    "banExpires" timestamp with time zone
);


--
-- Name: verification; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.verification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    scope text,
    password text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ads (
    id integer NOT NULL,
    campaign_name text NOT NULL,
    image_url text,
    link_url text,
    alt_text text,
    title text,
    body_text text,
    button_text text,
    page_target text DEFAULT 'all'::text NOT NULL,
    placement text DEFAULT 'top'::text NOT NULL,
    trigger text DEFAULT 'delay'::text NOT NULL,
    frequency text DEFAULT 'session'::text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    impressions integer DEFAULT 0 NOT NULL,
    clicks integer DEFAULT 0 NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    show_sponsored_label boolean DEFAULT true NOT NULL
);


--
-- Name: ads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ads_id_seq OWNED BY public.ads.id;


--
-- Name: banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banners (
    id integer NOT NULL,
    title text,
    subtitle text,
    image_url text NOT NULL,
    link_url text,
    link_label text,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    organization text,
    inquiry_type text DEFAULT 'Other'::text NOT NULL,
    subject text,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    event_date date NOT NULL,
    time_label text,
    location text,
    image_url text,
    is_featured boolean DEFAULT false NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    banner_url text,
    sponsors jsonb DEFAULT '[]'::jsonb NOT NULL,
    speakers jsonb DEFAULT '[]'::jsonb NOT NULL,
    join_url text,
    join_label text,
    subtitle text,
    venue text,
    secondary_url text,
    secondary_label text,
    highlights jsonb DEFAULT '[]'::jsonb NOT NULL,
    agenda jsonb DEFAULT '[]'::jsonb NOT NULL
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: events_organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events_organizations (
    id integer NOT NULL,
    event_id integer NOT NULL,
    organization_id integer NOT NULL,
    role_at_event text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: events_organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_organizations_id_seq OWNED BY public.events_organizations.id;


--
-- Name: events_people; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events_people (
    id integer NOT NULL,
    event_id integer NOT NULL,
    person_id integer NOT NULL,
    role_at_event text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: events_people_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_people_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_people_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_people_id_seq OWNED BY public.events_people.id;


--
-- Name: galleries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.galleries (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    category text DEFAULT 'Event'::text NOT NULL,
    cover_image_url text,
    photos jsonb DEFAULT '[]'::jsonb NOT NULL,
    event_date date,
    is_featured boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    location text
);


--
-- Name: galleries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.galleries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: galleries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.galleries_id_seq OWNED BY public.galleries.id;


--
-- Name: japan_hub_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.japan_hub_applications (
    id integer NOT NULL,
    company text NOT NULL,
    country text,
    website text,
    founder_name text NOT NULL,
    email text NOT NULL,
    phone text,
    industry text,
    funding_stage text,
    team_size text,
    message text,
    deck_url text,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'new'::text NOT NULL
);


--
-- Name: japan_hub_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.japan_hub_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: japan_hub_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.japan_hub_applications_id_seq OWNED BY public.japan_hub_applications.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    title text NOT NULL,
    type text DEFAULT 'Article'::text NOT NULL,
    url text,
    thumbnail_url text,
    source text,
    excerpt text,
    program_id integer,
    is_featured boolean DEFAULT false NOT NULL,
    published_at timestamp with time zone DEFAULT now() NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    logo_url text
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: member_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_applications (
    id integer NOT NULL,
    company_name text NOT NULL,
    applicant_name text NOT NULL,
    email text NOT NULL,
    phone text,
    website text,
    country text,
    category text DEFAULT 'Corporate Member'::text NOT NULL,
    description text,
    logo_url text,
    reason_for_joining text,
    linkedin_url text,
    message text,
    founder_name text,
    founder_photo text,
    founder_email text,
    status text DEFAULT 'pending'::text NOT NULL,
    review_notes text,
    organization_id integer,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: member_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: member_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.member_applications_id_seq OWNED BY public.member_applications.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.members (
    id integer NOT NULL,
    company_name text NOT NULL,
    founder_name text,
    website_url text,
    logo_url text,
    description text,
    category text DEFAULT 'corporate'::text NOT NULL,
    contact_email text,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    contact_url text,
    designation text
);


--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.members_id_seq OWNED BY public.members.id;


--
-- Name: membership_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.membership_plans (
    id integer NOT NULL,
    name text NOT NULL,
    icon text DEFAULT 'Users'::text NOT NULL,
    price text DEFAULT 'Free'::text NOT NULL,
    price_note text,
    period_label text DEFAULT '1 Year Membership'::text,
    badge text,
    description text DEFAULT ''::text NOT NULL,
    features jsonb DEFAULT '[]'::jsonb NOT NULL,
    cta_label text DEFAULT 'Join Now'::text NOT NULL,
    cta_url text,
    footnote text,
    accent text DEFAULT 'gold'::text NOT NULL,
    is_highlighted boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: membership_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.membership_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: membership_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.membership_plans_id_seq OWNED BY public.membership_plans.id;


--
-- Name: news_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_articles (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text,
    category text DEFAULT 'News'::text NOT NULL,
    image_url text,
    location text,
    published_at timestamp with time zone DEFAULT now() NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    external_url text,
    source text,
    status text DEFAULT 'published'::text NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    program_id integer,
    media_type text DEFAULT 'article'::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: news_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_articles_id_seq OWNED BY public.news_articles.id;


--
-- Name: news_organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_organizations (
    id integer NOT NULL,
    news_id integer NOT NULL,
    organization_id integer NOT NULL,
    role_at_news text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: news_organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_organizations_id_seq OWNED BY public.news_organizations.id;


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id integer NOT NULL,
    name text,
    email text NOT NULL,
    consent boolean DEFAULT true NOT NULL,
    source text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletter_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletter_subscribers_id_seq OWNED BY public.newsletter_subscribers.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id integer NOT NULL,
    name text NOT NULL,
    type text DEFAULT 'Member'::text NOT NULL,
    logo_url text,
    website_url text,
    country text,
    industry text,
    description text,
    status text DEFAULT 'approved'::text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    tags jsonb DEFAULT '[]'::jsonb NOT NULL,
    show_on_homepage boolean DEFAULT true NOT NULL
);


--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    name text NOT NULL,
    tier text DEFAULT 'strategic'::text NOT NULL,
    logo_url text,
    link_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: people; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.people (
    id integer NOT NULL,
    full_name text NOT NULL,
    profile_photo text,
    job_title text,
    company_name text,
    company_logo text,
    linkedin_url text,
    email text,
    country text,
    bio text,
    role_types jsonb DEFAULT '[]'::jsonb NOT NULL,
    tags jsonb DEFAULT '[]'::jsonb NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    status text DEFAULT 'published'::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    show_on_homepage boolean DEFAULT false NOT NULL,
    show_company_logo boolean DEFAULT true NOT NULL,
    show_linkedin boolean DEFAULT true NOT NULL,
    show_role_badge boolean DEFAULT false NOT NULL,
    author_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    organization_id integer
);


--
-- Name: people_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.people_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: people_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.people_id_seq OWNED BY public.people.id;


--
-- Name: playing_with_neon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.playing_with_neon (
    id integer NOT NULL,
    name text NOT NULL,
    value real
);


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.playing_with_neon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.playing_with_neon_id_seq OWNED BY public.playing_with_neon.id;


--
-- Name: program_overview; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.program_overview (
    id integer NOT NULL,
    program_id integer NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    display_position text DEFAULT 'after-banner'::text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    show_status_card boolean DEFAULT true NOT NULL,
    status_label text DEFAULT 'Program Status'::text,
    status_heading text,
    total_capacity integer,
    filled_slots integer DEFAULT 0,
    remaining_slots integer,
    capacity_mode text DEFAULT 'manual'::text NOT NULL,
    capacity_label text DEFAULT 'Remaining Slots'::text,
    application_open_date text,
    application_deadline text,
    program_start_date text,
    program_end_date text,
    deadline_label text DEFAULT 'Application Deadline'::text,
    status_mode text DEFAULT 'manual'::text NOT NULL,
    manual_status text DEFAULT 'upcoming'::text,
    published boolean DEFAULT false NOT NULL,
    updated_by text,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: program_overview_cta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.program_overview_cta (
    id integer NOT NULL,
    overview_id integer NOT NULL,
    label text NOT NULL,
    style text DEFAULT 'primary'::text NOT NULL,
    destination_type text DEFAULT 'external'::text NOT NULL,
    destination text,
    icon_value text,
    open_in_new_tab boolean DEFAULT true NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: program_overview_cta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.program_overview_cta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: program_overview_cta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.program_overview_cta_id_seq OWNED BY public.program_overview_cta.id;


--
-- Name: program_overview_feature; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.program_overview_feature (
    id integer NOT NULL,
    overview_id integer NOT NULL,
    value text,
    title text DEFAULT ''::text NOT NULL,
    subtitle text,
    icon_type text DEFAULT 'lucide'::text,
    icon_value text DEFAULT 'Rocket'::text,
    icon_colour text,
    link_url text,
    open_in_new_tab boolean DEFAULT false NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: program_overview_feature_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.program_overview_feature_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: program_overview_feature_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.program_overview_feature_id_seq OWNED BY public.program_overview_feature.id;


--
-- Name: program_overview_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.program_overview_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: program_overview_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.program_overview_id_seq OWNED BY public.program_overview.id;


--
-- Name: program_overview_language; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.program_overview_language (
    id integer NOT NULL,
    overview_id integer NOT NULL,
    locale text NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    badge text,
    heading text,
    content text,
    image_url text,
    image_alt text,
    image_caption text,
    image_position text DEFAULT 'bottom'::text,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: program_overview_language_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.program_overview_language_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: program_overview_language_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.program_overview_language_id_seq OWNED BY public.program_overview_language.id;


--
-- Name: programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.programs (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    icon text DEFAULT 'Rocket'::text NOT NULL,
    regions text,
    image_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    banner_url text,
    partners jsonb DEFAULT '[]'::jsonb NOT NULL,
    startups jsonb DEFAULT '[]'::jsonb NOT NULL,
    gallery jsonb DEFAULT '[]'::jsonb NOT NULL,
    title_ja text,
    excerpt_ja text,
    content_ja text,
    overview_ja text,
    benefits_ja text,
    eligibility_ja text,
    banner_height text DEFAULT 'medium'::text NOT NULL,
    application_deadline text,
    total_slots integer,
    remaining_slots integer,
    apply_url text,
    brochure_url text,
    highlights jsonb DEFAULT '[]'::jsonb NOT NULL,
    timeline jsonb DEFAULT '[]'::jsonb NOT NULL,
    hero_tagline_ja text,
    hero_event_label text,
    hero_items jsonb DEFAULT '[]'::jsonb NOT NULL,
    benefit_cards jsonb DEFAULT '[]'::jsonb NOT NULL,
    gallery_title text
);


--
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;


--
-- Name: programs_organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.programs_organizations (
    id integer NOT NULL,
    program_id integer NOT NULL,
    organization_id integer NOT NULL,
    role_at_program text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: programs_organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.programs_organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: programs_organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.programs_organizations_id_seq OWNED BY public.programs_organizations.id;


--
-- Name: programs_people; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.programs_people (
    id integer NOT NULL,
    program_id integer NOT NULL,
    person_id integer NOT NULL,
    role_at_program text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: programs_people_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.programs_people_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: programs_people_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.programs_people_id_seq OWNED BY public.programs_people.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL,
    "impersonatedBy" text
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    key text NOT NULL,
    value text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    bio text,
    image_url text,
    linkedin_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    company text
);


--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    image text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    banned boolean DEFAULT false,
    "banReason" text,
    "banExpires" timestamp with time zone
);


--
-- Name: verification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ads ALTER COLUMN id SET DEFAULT nextval('public.ads_id_seq'::regclass);


--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: events_organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events_organizations ALTER COLUMN id SET DEFAULT nextval('public.events_organizations_id_seq'::regclass);


--
-- Name: events_people id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events_people ALTER COLUMN id SET DEFAULT nextval('public.events_people_id_seq'::regclass);


--
-- Name: galleries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries ALTER COLUMN id SET DEFAULT nextval('public.galleries_id_seq'::regclass);


--
-- Name: japan_hub_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.japan_hub_applications ALTER COLUMN id SET DEFAULT nextval('public.japan_hub_applications_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: member_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_applications ALTER COLUMN id SET DEFAULT nextval('public.member_applications_id_seq'::regclass);


--
-- Name: members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: membership_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.membership_plans ALTER COLUMN id SET DEFAULT nextval('public.membership_plans_id_seq'::regclass);


--
-- Name: news_articles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_articles ALTER COLUMN id SET DEFAULT nextval('public.news_articles_id_seq'::regclass);


--
-- Name: news_organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_organizations ALTER COLUMN id SET DEFAULT nextval('public.news_organizations_id_seq'::regclass);


--
-- Name: newsletter_subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers ALTER COLUMN id SET DEFAULT nextval('public.newsletter_subscribers_id_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: people id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.people ALTER COLUMN id SET DEFAULT nextval('public.people_id_seq'::regclass);


--
-- Name: playing_with_neon id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playing_with_neon ALTER COLUMN id SET DEFAULT nextval('public.playing_with_neon_id_seq'::regclass);


--
-- Name: program_overview id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview ALTER COLUMN id SET DEFAULT nextval('public.program_overview_id_seq'::regclass);


--
-- Name: program_overview_cta id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview_cta ALTER COLUMN id SET DEFAULT nextval('public.program_overview_cta_id_seq'::regclass);


--
-- Name: program_overview_feature id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview_feature ALTER COLUMN id SET DEFAULT nextval('public.program_overview_feature_id_seq'::regclass);


--
-- Name: program_overview_language id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview_language ALTER COLUMN id SET DEFAULT nextval('public.program_overview_language_id_seq'::regclass);


--
-- Name: programs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);


--
-- Name: programs_organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs_organizations ALTER COLUMN id SET DEFAULT nextval('public.programs_organizations_id_seq'::regclass);


--
-- Name: programs_people id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs_people ALTER COLUMN id SET DEFAULT nextval('public.programs_people_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: invitation; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.invitation (id, "organizationId", email, role, status, "expiresAt", "createdAt", "inviterId") FROM stdin;
\.


--
-- Data for Name: jwks; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.jwks (id, "publicKey", "privateKey", "createdAt", "expiresAt") FROM stdin;
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.member (id, "organizationId", "userId", role, "createdAt") FROM stdin;
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.organization (id, name, slug, logo, "createdAt", metadata) FROM stdin;
\.


--
-- Data for Name: project_config; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.project_config (id, name, endpoint_id, created_at, updated_at, trusted_origins, social_providers, email_provider, email_and_password, allow_localhost, plugin_configs, webhook_config) FROM stdin;
f6f16439-fc23-4e21-a0aa-9bb22b720ada	neon-lime-yacht	ep-broad-mud-aic5c1zr	2026-06-14 13:02:00.479+00	2026-06-14 13:02:00.479+00	[]	[{"id": "google", "isShared": true}]	{"type": "shared"}	{"enabled": true, "disableSignUp": false, "emailVerificationMethod": "otp", "requireEmailVerification": false, "autoSignInAfterVerification": true, "sendVerificationEmailOnSignIn": false, "sendVerificationEmailOnSignUp": false}	t	{"magicLink": {"config": {"expiresIn": 5, "disableSignUp": false}, "enabled": false}, "phoneNumber": {"config": {"otp_expires_in": 300}, "enabled": false}, "organization": {"config": {"creatorRole": "owner", "membershipLimit": 100, "organizationLimit": 10, "sendInvitationEmail": false}, "enabled": true}}	{"enabled": false, "enabledEvents": [], "timeoutSeconds": 5}
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId", "impersonatedBy", "activeOrganizationId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", role, banned, "banReason", "banExpires") FROM stdin;
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
VXysanWPeghPpPP0q7RufFORtDmnxPzg	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	credential	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N	\N	\N	\N	\N	\N	73de3315c61837b7f6343882411bb03a:1c6f3e359a394bfc7d9ecb0b1e8dff5d0683bfbb388243172bde3d276d295b7340a1fd0fa4ccf53f02c0bfb9594e6f6aa6aab595b23c01b8ac8beeceed4ecb51	2026-06-14 15:14:30.416+00	2026-06-14 15:14:30.416+00
cC5AyAdWnbtcB5Jl7NB6dvxjqTeLOLc1	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	credential	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N	\N	\N	\N	\N	\N	fc8c990372d8709be5d6fe29a83501b4:e91d72cd176a9e867a495191900d1f3005171466fb4f2fbddd656229ecd20eeaddff88f1872bbe78bd080d56666c88412ce449e42153e21bb64704f27cb55d30	2026-06-15 02:46:02.852+00	2026-06-15 02:46:02.852+00
OaY30CzlzWL07rKEZI3FiWW2z7Fq0INj	4vbFW10lrYeoiizfxCDxhmyKILXa98M2	credential	4vbFW10lrYeoiizfxCDxhmyKILXa98M2	\N	\N	\N	\N	\N	\N	9cf6959aaa71f17adb5bbd191a160679:ffe29f4cf2a8c520e2a650651d8eeedcf86e412eb674871cd0e7c2f795e7ec4d97d66a4d978eb7654b0b336b3e1b952685909aac9dd3c20ead44005519b95cff	2026-07-10 08:59:43.739+00	2026-07-10 08:59:43.739+00
\.


--
-- Data for Name: ads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ads (id, campaign_name, image_url, link_url, alt_text, title, body_text, button_text, page_target, placement, trigger, frequency, status, start_date, end_date, impressions, clicks, sort_order, author_id, created_at, updated_at, show_sponsored_label) FROM stdin;
11	bottom	/images/blockza-mobile-ads-96979a71.gif	https://blockza.io/experts/	\N	\N	\N	\N	all	bottom	delay	session	active	\N	\N	558	1	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-28 07:06:59.378912	2026-06-28 07:07:59.486	f
2	Newsletter Signup	\N	\N	\N	Join the AWAJ community	Get the latest events, programs, and opportunities in your inbox.	Subscribe	all	newsletter	delay	session	active	\N	\N	1543	4	0	seed	2026-06-23 05:59:31.636321	2026-06-28 08:04:40.232	f
12	mobile 2	/images/Jun-28-2026-04_57_22-PM-a2802997.png	https://www.asiaweb3alliance.jp/membership	\N	\N	\N	\N	all	floating	immediate	session	active	\N	\N	3356	5	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-28 08:04:11.300187	2026-06-28 08:06:54.711	f
10	Blockza mobile	/images/blockza-mobile-ads-bd63324c.gif	https://blockza.io/experts/	\N	\N	\N	\N	all	mobile-sticky	immediate	session	active	\N	\N	3439	1	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-28 06:20:39.125132	2026-06-28 07:03:42.596	t
4	WebX AWAJ	/images/Webx-AWAJ-1--440a66eb.gif	https://webx-asia.com/ticket/?promo=WebX2026_AWAJ	\N	\N	\N	\N	all	in-content	delay	session	hidden	\N	\N	2	0	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 08:10:46.273156	2026-06-27 08:14:58.729	f
6	sampl	/images/blockza-ads-74111289.png	https://blockza.io/experts/	\N	\N	\N	Register Now 	all	floating	delay	always	active	\N	\N	98	0	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-28 05:51:36.6296	2026-07-07 16:22:04.83	t
1	WebX AWAJ	/images/Webx-AWAJ-1--ebf5c6d0.gif	https://webx-asia.com/ja/ticket/?promo=WebX2026_AWAJ	WebX AWAJ	AWAJ Digital Economy Forum 2026 | Tokyo Edition	\N	\N	all	top	delay	session	hidden	\N	\N	382	4	0	seed	2026-06-23 05:59:31.636321	2026-07-01 02:04:04.349	f
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.banners (id, title, subtitle, image_url, link_url, link_label, is_active, sort_order, author_id, created_at) FROM stdin;
9	\N	\N	/images/Jun-28-2026-04_57_22-PM-25e261c2.png	\N	\N	t	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-28 07:58:29.757706+00
8	Your Ultimate Partner	\N	/images/e135afe7-4dcb-46f1-a33f-4fc6ed0c5343-915e39f8.png	\N	\N	t	1	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-28 04:44:27.345416+00
4	\N	\N	/images/website-banner-2--5dc7e6ee.png	\N	\N	t	2	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:43:04.572688+00
5	\N	\N	/images/67ae22a6-18fb-4aef-8360-979e7c8f46f3-353cf91b.png	\N	\N	t	3	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 12:51:14.400677+00
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, name, email, organization, inquiry_type, subject, message, is_read, created_at) FROM stdin;
2	Hinza Asif	hinza@nftstudio24.com	一般社団法人ASIA WEB3 ALLIANCE JAPAN	Partnership	as	asafgfgfgfgfgf	t	2026-06-14 17:26:45.32221+00
3	Gaurav	gaurav.manu13@gmail.com	blockza	Partnership	this is for test	test only jasdgja hhadsas kashdka	t	2026-06-15 04:45:12.776035+00
4	Manu	hinza@nftstudio24.com	blockza	Partnership	this is for test	sdadasd zczx fsaf asdsad	t	2026-06-19 12:13:06.381306+00
6	Yasir Saboor Rathore	ysaboor34@gmail.com	Saboor and Sons Global Consultants	Partnership	Looking for business partners from Japan	Looking for business partners from Japan	t	2026-06-30 19:35:59.383409+00
9	平林滉也	k.hirabayashi@unou.design	unou株式会社	Partnership	業務委託エンジニアの採用募集に関するご提案	一般社団法人Asia Web3 Alliance Japan ご担当者様\n\n突然のご連絡失礼いたします。\nunou株式会社の平林と申します。\n\n貴社がSOKUDANに掲載されている「バックエンドエンジニア・インフラエンジニア」の業務委託募集を拝見しました。Web3×FinTech領域でCTO候補として技術戦略をリードできるエンジニアを求めていらっしゃることから、弊社の体制がお役に立てるのではないかと考え、ご連絡しております。\n\n弊社は、エンジニア1名を窓口に、PM・デザイナー・エンジニアがチームで案件を引き受ける業務委託サービス「OneArc」を提供しております。事業背景・目的・要件・進捗を全員で共有し、必要に応じて要件整理、優先順位の判断、画面設計、技術方針、実装を分担します。\n\n開発面では、国内とシリコンバレーの両拠点にエンジニアを擁し、AIエージェントや業務自動化基盤の設計・開発から、技術選定・アーキテクチャ設計までを担います。自社の開発・運営にもAIとオートメーションを組み込み、AI前提の業務設計を日常的に実践しています。\n\nそのため、要件が固まりきっていない段階からでも、事業目的を実装可能な仕様へ落とし込み、設計・開発まで一貫して進められます。\n\n現在掲載されている予算・稼働条件を前提に、一般的な業務委託と同様に1人月から対応可能です。弊社の体制や進め方、よくあるご質問は、サービスサイト「OneArc」でもご確認いただけます。現在の開発体制や募集背景について、20〜30分ほどオンラインでお話しする機会をいただけないでしょうか。\n\nご関心がございましたら、ご担当者様へお取り次ぎいただけますと幸いです。\n何卒よろしくお願いいたします。\n\nunou株式会社｜OneArc｜CEO 平林滉也｜k.hirabayashi@unou.design｜https://onearc.unou.design/?ref=c919	t	2026-07-31 05:30:31.458625+00
8	市川駿希	ichikawa@nexusmarkets-inc.com	株式会社Nexus Markets	Media	貴社媒体への広告掲載につきまして	お世話になっております。\n株式会社 Ｎｅｘｕｓ　Ｍａｒｋｅｔｓの市川と申します。\n\n現在、貴社媒体への広告出稿を検討しております。\n\n弊社でお預かりしている案件について、広告掲載が可能か確認したく、お問い合わせいたしました。\n\nご参考までに、対象案件のサービスURLを記載いたします。\n\n【対象案件】\n・Clend\nhttps://clend.io/jp/\n\n・Smart Lending\nhttps://smartlending.jp/\n\n・Cryoto Pawn\nhttps://cryptopawn.io/\n\n\n\n掲載可能な場合は、下記項目もご教示いただけますと幸いです。\n\n・ご利用可能な広告メニュー\n・出稿時の金額\n\nまた、掲載が難しい案件がございましたら、差し支えない範囲でその理由や判断基準についてもご教示いただけますと幸いです。\n今後のご提案や案件選定の参考にさせていただきたく存じます。\n\nお忙しいところ恐縮ですが、ご確認のほどよろしくお願いいたします。	t	2026-07-28 03:58:31.146258+00
12	Anna Kaic	anna.kaic@ethglobal.com	ETHGlobal	Partnership	ETHGlobal Tokyo	Hi Asia Web3 Alliance Japan,\n\nI'm Anna from ETHGlobal and we're running a hackathon in Tokyo, as part of the ETHTokyo week, on September 26-27 and wanted to invite your community to participate. Is this something you'd be interested in?\n\nThe event is free (including meals), with $75k+ USD in prizes and mentorship from companies like Uniswap, 1inch, ENS, and World. We also have a new Continuity Track which allows you to build on existing code instead of starting from scratch.\n\nIf interested, we can send a custom link that will fast track your application process so let me know if you have any questions!\n\nBest,\nAnna	t	2026-08-11 15:50:08.517209+00
15	Ljxoay Hkmefaay	i.guva.wa.xa7.64@gmail.com	Knlbjjih LLC	Partnership	EcsatLgqpwcDOhhcExClgdjn	8702495326	f	2026-08-27 09:47:47.595133+00
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (id, title, slug, excerpt, content, event_date, time_label, location, image_url, is_featured, author_id, created_at, banner_url, sponsors, speakers, join_url, join_label, subtitle, venue, secondary_url, secondary_label, highlights, agenda) FROM stdin;
13	HYPE UP TOKYO - Web3 Leaders & KOLs Assembly Gala: Beyond The Spotlight 🇯🇵 Web3リーダーとKOLsの集い：スポットライトを超えて	hype-up-tokyo-web3-leaders-kols-assembly-gala-beyond-the-spotlight-web3kols	Under the dazzling Tokyo skyline, this event brings together the world’s most influential Web3 leaders and KOLs for an exclusive evening that goes beyond the spotlight. Co‑hosted by Hype3 and BuzzUp HQ, Anome and Bitget Wallet, along with other top‑tier partners, it is billed as the most influential Web3 gala of the year	<p>🚀 <strong>HYPE UP TOKYO — Web3 Leaders &amp; KOLs Assembly Gala: Beyond The Spotlight</strong></p><p>​Under the dazzling Tokyo skyline, we are bringing together the world’s most influential Web3 leaders and KOLs for an exclusive evening that goes beyond the spotlight.</p><p>​Co-hosted by Hype3 and BuzzUp HQ, Anome in collaboration with Bitget Wallet, and other top-tier partners, this is set to be the most influential Web3 gala of the year.</p><p>​📅 Date: Aug 25, 2025</p><p>​​⏰ Time: 6:00 PM – 10:00 PM</p><p>​​📍 Location: Shankureru Ginza ZX Kaijo</p><p>​</p><p>​💡 Why You Should Join</p><p>​• Elite Networking: Connect closely with top Web3 leaders, investors, and decision-makers from Japan and around the globe</p><p>​• Direct Access: Meet leading projects, exchanges, media, and brands</p><p>​• Your Stage: Showcase your influence and expand your global presence</p><p>​• VIP Experience: Immersive atmosphere, private networking spaces and premium connections</p><p>​</p><p>​🎯 Who Should Attend</p><p>​KOLs, creators, and professionals in Web3, blockchain, crypto, NFT, GameFi, SocialFi, and beyond.Join us for an exclusive networking convergence in Tokyo — a high-impact gathering of Web3 leaders &amp; KOLs, GameFi builders, and global crypto communities.</p><p>​</p><p>​<strong>​</strong>🗓️ <strong>Agenda</strong>:</p><p>​​18:00 📝 <em>Registration</em></p><p>​​18:30 🎊 <em>Event Starts</em></p><p>​​18:45 - 19:15 🪢 <em>Networking&nbsp;</em></p><p>​​19:15 - 20:00 💡 <em>Panel Session</em></p><p>​​20:00 - 20:45 🫂 <em>Connect with our Partners</em></p><p>​20:45 - 21:15 🎁 <em>Lucky Draw</em></p><p>​21:15 - 22:00<em> </em>🪢 <em>Networking&nbsp;</em></p><p>​</p><p>​🚀 <strong>HYPE UP TOKYO</strong> — <strong>Web3リーダーとKOLsの集い：スポットライトを超えて</strong></p><p>​東京の華やかな夜景の下、世界中から最も影響力のあるWeb3リーダーとKOLが集結し、スポットライトを超える特別な一夜をお届けします。 Hype3 と BuzzUp HQ が主催し、Anome が協力、Bitget Wallet やその他のトップパートナーと共に、今年最も影響力のあるWeb3ガラを開催します。</p><p>​📅 日付：2025年8月25日（月） ⏰ 時間：18:00 – 22:00 📍 会場：Shankureru Ginza ZX Kaijo</p><p>​</p><p>​💡 参加すべき理由 • エリートネットワーキング：日本および世界中のWeb3リーダー、投資家、意思決定者と直接交流 • 直接アクセス：主要プロジェクト、取引所、メディア、ブランドと出会えるチャンス • あなたの舞台：影響力を発揮し、国際的な存在感を拡大 • VIP体験：没入型の雰囲気、専用ネットワーキングスペース、そしてプレミアムな繋がり</p><p>​</p><p>​🎯 対象者 Web3、ブロックチェーン、暗号資産、NFT、GameFi、SocialFiなどの分野で活躍するKOL、クリエイター、業界関係者。</p><p>​</p><p>​🗓️ アジェンダ：</p><p>​18:00 📝 受付開始</p><p>​18:30 🎊 イベント開始</p><p>​18:45 - 19:15 🪢 ネットワーキング</p><p>​19:15 - 20:00 💡 パネルセッション</p><p>​20:00 - 20:45 🫂 パートナーとの交流</p><p>​20:45 - 21:15 🎁 抽選会</p><p>​21:15 - 22:00 🪢 ネットワーキング</p><p>​</p><p>​<strong>Co-hosted</strong>:</p><p>​​​<strong>🔹 About Hype3</strong></p><p>​<em>Hype3 – Web3 Marketing Consultancy &amp; Agency, Built Different</em></p><p>​<em>​Born from the Blockchain. Built to Last.</em></p><p>​<em>​Our team has grown communities, scaled ecosystems, and driven adoption across 8+ diverse markets. From Hong Kong to India, Japan to Vietnam — we're on the ground, in the culture, and speaking the native language of crypto.</em></p><p>​​​Learn more: <a target="_blank" rel="noopener noreferrer" href="http://hype-3.com">hype-3.com</a></p><p>​</p><p>​​<strong>​🔹 About BuzzUp</strong></p><p>​<em>​​BuzzUp </em>🐝 <em>A Decentralized Social Wallet that redefines how we connect, transact, and explore the Web3 ecosystem </em>🍯<em> — all within a single mobile app</em>📱</p><p>​​Learn more: <a target="_blank" rel="noopener noreferrer" href="http://buzz-up.io">buzz-up.io</a></p><p>​​</p><p>​​<strong>​🔹 About Anome</strong></p><p>​<em>​ANOME is a leading Web3 technology interactive entertainment and R&amp;D company, founded in 2023 and headquartered in Singapore. ANOME is dedicated to innovating entertainment across many countries.&nbsp;</em></p><p>​​Learn more: <a target="_blank" rel="noopener noreferrer" href="https://x.com/Anome_Official">https://x.com/Anome_Official</a></p><p><strong>Location</strong></p><p><strong>Shankureru Ginza ZX Kaijo</strong></p><p>Japan, 〒104-0061 Tokyo, Chuo City, Ginza, 1-chōme−5−１３ ゼットエックス銀座ビル 10F, シャンクレール 銀座ZX会場</p><p>10/F</p><p><br></p>	2025-08-25	6:00 PM - 10:00 PM GMT+9	10F ZX Building, 1‑5‑13 Ginza, Chuo City, Tokyo 104‑0061, Japan	/images/539afcd7-01ae-475b-b8f6-a958223b83f5-f024706d.avif	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:34:03.434532+00	\N	[]	[]	https://luma.com/5yogyfi3	Request to Join	Exclusive gala under the Tokyo skyline	Shankureru Ginza ZX Kaijo	\N	\N	[]	[]
2	Join the Japan Hub | Web3 Salon Community Event!	join-the-japan-hub-web3-salon-community-event	VC Networking, Pitch Session & Exhibition in Singapore.	<p>🌸 <strong>Japan Hub | Web3 Salon Side Event @ TOKEN2049 – Connecting Japan with the Global Web3 Stage</strong> 🌸</p><p>​For the very first time, <strong>Japan Hub Pavilion</strong> will showcase leading Japanese Web3 startups and ecosystem builders on the international stage at <strong>TOKEN2049 Singapore</strong>. This exclusive side event is your opportunity to experience Japan’s innovation and connect with global leaders.</p><p>​🚀 <strong>Why Join the Japan Hub Side Event?</strong></p><ul><li><p>​Meet and connect directly with top Japanese Web3 companies seeking global partners.</p></li><li><p>​Discover cross-border opportunities in blockchain, AI, DeFi, gaming, and more.</p></li><li><p>​Gain insights from founders, VCs, and key ecosystem builders shaping the future.</p></li><li><p>​Build long-term collaborations with one of the world’s fastest-growing Web3 markets.</p></li></ul><p>​<strong>14:30 – 14:40 | Opening &amp; Welcome Remarks</strong></p><ul><li><p>​Introduction by <strong>JETRO</strong></p></li></ul><p>​<strong>14:40 – 15:00 | Keynote Address</strong></p><ul><li><p>​<strong>Web3 Salon</strong>: The Future of Innovation &amp; Collaboration</p></li></ul><p>​<strong>15:00 – 16:00 | Japan Hub Exhibitor Pitches</strong></p><ul><li><p>​8 Japanese Companies present their projects and solutions</p></li></ul><p>​<strong>16:00 – 16:15 | Special Performance</strong></p><ul><li><p>​<strong>Clon Giles</strong> (15 minutes)</p></li></ul><p>​<strong>16:15 – 17:30 | Networking &amp; Drinks</strong></p><ul><li><p>​Open networking session with speakers, exhibitors, and attendees</p></li></ul><p>​<strong>Partners List of Japan Hub :</strong><br>1. Main Partner <strong>Golfin </strong>| <a target="_blank" rel="noopener noreferrer" href="https://golfin.io/en/">https://golfin.io/en/</a></p><p>​GOLFIN , world's first NFT golf game , seeks to blend the real world of golf with digital gaming, addressing challenges in both areas to create a new economic sphere. The mission promotes health by encouraging more people to play golf and enjoy nature. Players earn experience points and rewards through real-world golfing. They can win prizes (tokens) by enhancing their avatars, equipping items, and improving their skills. The game offers exciting challenges, requiring players to overcome hurdles to earn tokens and foster sustainability.<br><br>2. <strong>Global Entertainment Token (GET)</strong> | <a target="_blank" rel="noopener noreferrer" href="https://global-entertainment-token.org/">https://global-entertainment-token.org/</a></p><p>​Global Entertainment Token (GET) is a blockchain-driven initiative focused on redefining the entertainment industry by integrating digital assets and tokenized ecosystems. The project seeks to support artists, creators, and entertainment platforms by offering new avenues for monetization, fan engagement, and global reach. With a mission to empower stakeholders across music, film, and gaming, GET leverages blockchain transparency and security to build a more inclusive and rewarding entertainment economy for both creators and audiences.</p><p>​3.<strong> MEC Labo</strong> | <a target="_blank" rel="noopener noreferrer" href="https://meclabo.com/">https://meclabo.com/</a></p><p>​MEC Labo is a Japanese technology and consulting company specializing in advancing Web3 and digital transformation initiatives. Through collaborations with businesses and organizations, MEC Labo provides strategic insights, development support, and research into cutting-edge technologies such as blockchain, metaverse solutions, and digital assets. Their goal is to promote innovation by helping companies adopt next-generation technologies and apply them effectively in real-world scenarios, bridging the gap between emerging digital trends and practical business applications.</p><p>​4. <strong>TON Japan</strong> | <a target="_blank" rel="noopener noreferrer" href="https://ton-japan.org">https://ton-japan.org</a></p><p>​TON Japan is the official community and ecosystem hub for The Open Network (TON) in Japan. The organization is dedicated to promoting TON blockchain adoption by connecting developers, businesses, and users to the growing TON ecosystem. TON Japan provides education, resources, and networking opportunities to support projects built on TON, while fostering collaboration within the Web3 space. By serving as a gateway to the Japanese market, TON Japan plays a vital role in expanding the reach and impact of the TON blockchain globally.</p><p>​5.<strong> 0 x Consulting Group</strong> | <a target="_blank" rel="noopener noreferrer" href="https://zero-x.com/en/home-en/">https://zero-x.com/en/home-en/</a></p><p>​0 x Consulting Group is a strategic consulting firm that focuses on Web3, blockchain, and digital asset transformation. The company supports enterprises, startups, and institutions in navigating decentralized technologies, offering expertise in business development, project incubation, and investment strategies. With a global perspective and strong industry connections, 0x Consulting Group empowers clients to leverage blockchain solutions for growth, innovation, and long-term success.</p><p>​6. <strong>The Asset Advisors</strong> | <a target="_blank" rel="noopener noreferrer" href="https://theassetsadvisors.com/">https://theassetsadvisors.com/</a></p><p>​The Asset Advisors building the next-generation platform called Mirai X that bridges institutional investors, visionary entrepreneurs, and global markets. Rooted in the discipline of Japanese precision and fueled by the bold ambition of the UAE, our mission is to redefine access to real assets worldwide.</p><p>​7. <strong>Digital Entertainment Asset Pte Ltd</strong> | <a target="_blank" rel="noopener noreferrer" href="https://dea.sg/en/Partners">https://dea.sg/en/Partners</a></p><p>​Digital Entertainment Asset Pte. Ltd. is a Singapore-based Web3 entertainment company specializing in “PlayMining,” a platform that merges gaming, digital asset ownership, and the creator economy. DEA develops blockchain-powered games, NFTs, and entertainment content that allow players to earn rewards while engaging in fun and interactive experiences. By combining digital assets with entertainment, DEA empowers creators and gamers worldwide, fostering a sustainable ecosystem where entertainment translates into tangible value.</p><p>​Support by:</p><p>​JETRO Singapore: Connecting Japan to the World</p><p>​<a target="_blank" rel="noopener noreferrer" href="https://www.jetro.go.jp/singapore/">https://www.jetro.go.jp/singapore/</a></p><p>​JETRO Singapore serves as a vital bridge between Japan and global markets, supporting businesses, startups, and investors in expanding across Asia. With a strong network, market expertise, and strategic partnerships, JETRO Singapore fosters innovation, accelerates growth, and creates cross-border opportunities that unite Japanese excellence with international ambition.<br><br>✨ Whether you are an <strong>investor, founder, or enterprise</strong>, the Japan Hub Side Event is the gateway to meaningful collaboration, networking, and growth.</p><p>​📍<strong> Don’t miss the chance to meet Japan’s top Web3 projects at TOKEN2049.</strong></p>	2025-10-03	12:00 – 16:30	Akasaka, Minato-ku, Tokyo, Japan	/images/45d0fc20-fd4b-4a46-842b-2b83341efaba-e9ed0741.avif	f	seed	2026-06-14 13:28:33.643371+00	\N	[{"name": "Ripple", "tier": "Diamond Sponsor"}, {"name": "SMBC Nikko", "tier": "Platinum Sponsors"}, {"name": "Mizuho", "tier": "Platinum Sponsors"}, {"name": "SBI Holdings", "tier": "Gold Sponsors"}, {"name": "Nomura", "tier": "Gold Sponsors"}, {"name": "TIS", "tier": "Gold Sponsors"}, {"name": "Microsoft", "tier": "Silver Sponsors"}, {"name": "AWS", "tier": "Silver Sponsors"}, {"name": "Google Cloud", "tier": "Silver Sponsors"}, {"name": "JETRO", "tier": "Supporting Partners"}, {"name": "FINOLAB", "tier": "Supporting Partners"}]	[{"name": "Takeshi Chino", "role": "Global Head of Fintech", "badge": "Keynote", "company": "PwC Japan"}, {"name": "Rie Nakajima", "role": "Executive Officer", "badge": "Panelist", "company": "MUFG Bank"}, {"name": "Adam Yaziri", "role": "VP, Head of Strategy", "badge": "Panelist", "company": "Ripple"}, {"name": "Hiroyuki Shinozaki", "role": "CEO", "badge": "Panelist", "company": "Securitize Japan"}, {"name": "Yuko Miyazaki", "role": "Founder & CEO", "badge": "Moderator", "company": "CryptoLab Inc."}, {"name": "Koji Watanabe", "role": "Head of Web3 Business", "badge": "Panelist", "company": "SBI Holdings"}]	https://lu.ma/awaj	Register Now	Awards & Future of Finance Leadership Dialogue	Ark Mori Building, 7F	https://example.com/agenda	View Agenda	[{"title": "Startup Pitches", "description": "Watch innovative startups pitch to investors & partners."}, {"title": "Industry Dialogue", "description": "Engage with leaders from finance, Web3, and government."}, {"title": "Awards Ceremony", "description": "Celebrate outstanding startups and innovators."}, {"title": "Networking", "description": "Connect with founders, investors, and institutions."}]	[{"time": "12:00 – 12:30", "title": "Registration & Networking", "description": "Check-in and connect with industry leaders."}, {"time": "12:30 – 12:40", "title": "Opening Remarks", "description": "Welcome address by Asia Web3 Alliance Japan."}, {"time": "12:40 – 13:30", "title": "Keynote Session", "description": "The Future of Finance: Innovation, Inclusion, and Impact."}, {"time": "13:30 – 14:00", "title": "Industry Leaders Dialogue", "description": "Leadership perspectives on Japan's financial innovation ecosystem."}, {"time": "14:00 – 15:00", "title": "Startup Pitch Session", "description": "Selected startups pitch cutting-edge solutions."}, {"time": "15:00 – 15:20", "title": "Coffee Break & Networking", "description": "Refreshments and curated networking."}, {"time": "15:20 – 16:10", "title": "Awards Ceremony", "description": "Recognition of outstanding startups and leaders."}, {"time": "16:10 – 16:30", "title": "Closing Remarks & Group Photo", "description": "Closing remarks and networking."}]
15	Investor Alpha: Where Smart Money Is Flowing in Web3	investor-alpha-where-smart-money-is-flowing-in-web3	Join us for an exclusive Web3 investment‑focused side event during IVS Kyoto 2025, hosted by Web3 Salon, Asia Web3 Alliance Japan (AWAJ), JETRO and N.Avenue (CoinDesk JAPAN). This session convenes leading investors, founders and ecosystem builders to explore where capital, conviction and innovation are converging in the Web3 space. From global VC trends to Japanese regulatory insights, the event offers rare perspectives on what’s driving smart money—and what founders need to know to build trusted, fundable and scalable projects	<p>イベント概要</p><p>​​IVS京都2025の開催期間中、<a target="_blank" rel="nofollow noopener" href="https://web3salon.or.jp/?utm_source=luma">Web3 Salon</a>、<a target="_blank" rel="nofollow noopener" href="https://asiaweb3alliance.jp/?utm_source=luma">Asia Web3 Alliance Japan (AWAJ)</a>、<a target="_blank" rel="nofollow noopener" href="https://www.jetro.go.jp/?utm_source=luma">ジェトロ</a>、そして<a target="_blank" rel="nofollow noopener" href="https://navenue.jp/?utm_source=luma">N.Avenue株式会社 </a><a target="_blank" rel="nofollow noopener" href="https://www.coindeskjapan.com/?utm_source=luma">(CoinDesk JAPAN)</a> の共同主催による、Web3投資に特化した限定サイドイベントへようこそ。本セッションでは、業界をリードする投資家、創業者、エコシステムビルダーが一堂に会し、Web3分野において資本、確信、そしてイノベーションがどこで融合しつつあるのかを探求します。</p><p>​​グローバルなVCのトレンドから日本の規制に関する洞察に至るまで、本イベントは「スマートマネー」を動かすものは何か、そして創業者が信頼され、資金調達可能でスケーラブルなプロジェクトを構築するために知っておくべきことについて、貴重な視点を提供します。</p><p>​イベント詳細</p><p>​​📅 日時：2025年7月3日（木）</p><p>​🕒 時間：14:30〜16:50（日本標準時）</p><p>​📍 会場：京都経済センター 3階 – KOIN</p><p>​🎤 形式：パネルディスカッション＋ネットワーキング</p><p>​👥 対象：Web3スタートアップの創業者、投資家、アクセラレーター、企業、メディア関係者</p><p>​🪑 定員：80〜100名（事前登録制）</p><p>​</p><p>​<strong>🗓 アジェンダ</strong></p><p>​<strong>14:30 – 15:00</strong> | 受付・ウェルカムトーク – Hinza Asif&nbsp;</p><p>​<strong>15:00 – 15:05</strong> | 開会のご挨拶・JETROによるプレゼンテーション&nbsp;</p><p>​<strong>15:05 – 15:10</strong> |&nbsp; Web3サロンのご紹介 – Hinza Asif&nbsp;</p><p>​<strong>15:10 – 15:20 | </strong>Rippleの日本市場での取り組み – 下山 貴史<br>SBI Ripple Asia株式会社 セールス＆カスタマー・サクセス事業本部 部長<br>日米証券会社勤務、投資会社運営を経てSBI Ripple Asia参画。現実資産（RWA）のトークン化や国際送金領域における外部パートナーとのアライアンスを含む事業開発を推進。</p><p>​<strong>15:20 – 15:30</strong> | Coindesk / N.Avenue</p><p>​<strong>15:30 – 16:15</strong> | パネルディスカッション</p><p>​<strong>テーマ：</strong>「Investor Alpha：スマートマネーはWeb3のどこに向かっているのか」</p><p>​<strong>Web3 Speakers:&nbsp;</strong></p><p>​・ジョナサン・M・ハヤシ | Headline Asia&nbsp;</p><p>​・檜山 悠太朗 | マネーフォワードベンチャーパートナーズ株式会社 シニア・アソシエイト (HIRAC FUND)&nbsp;</p><p>​・牛田 遼介 | 金融庁　総合政策局フィンテック参事官室 イノベーション推進室長兼チーフ・フィンテック・オフィサー</p><p>​<strong>Moderator</strong>: 神本 侑季 | N.Avenue株式会社（CoinDesk JAPAN） 代表取締役CEO&nbsp;</p><p>​16:15 – 16:50 | ネットワーキング</p><hr><p>​<strong>🎙️ 登壇者紹介</strong></p><p>​<strong>ジョナサン・M・ハヤシ 氏</strong><br>パートナー｜Headline Asia<br>日本生まれ、中国育ち。ロチェスター大学にて金融経済学と光学工学の二重学位を取得。<br>SMBC日興証券で投資銀行業務からキャリアをスタートし、SBIインベストメントにてフィンテックおよびブロックチェーン領域を中心に30件以上の投資を主導。Forbes JAPAN「最も影響力のあるベンチャー投資家ランキング」に最年少で選出。Headline Asiaでは投資業務およびIVS運営をリードし、暗号資産ファンド「IVC」の立ち上げも主導。</p><hr><p>​<strong>牛田 遼介 氏</strong><br>金融庁 イノベーション推進室 室長／チーフ・フィンテック・オフィサー<br>2010年に金融庁入庁。AIやブロックチェーン関連を中心としたイノベーション政策を担当。国際的なAML/CFTルール形成に貢献するFATF暗号資産コンタクトグループの共同議長も務める。過去には、ジョージタウン大学で分散型金融（DeFi）のガバナンスに関する研究も行う。東京大学（工学部）、ロンドン・ビジネス・スクール（金融学修士）卒業。</p><hr><p>​<strong>神本 侑季 氏</strong><br>代表取締役CEO｜N.Avenue株式会社（CoinDesk JAPAN）<br>2013年にヤフー株式会社入社後、メディア・広告領域の事業開発を担当。2018年にWeb3メディア事業を展開するN.Avenue株式会社を設立し、のちに独立。グローバルWeb3メディア「CoinDesk JAPAN」の運営や、日本最大級のWeb3ビジネスコミュニティ「N.Avenue Club」の展開を手がける。現在、ブロックチェーン推進協会（BCCC）理事およびJapan Blockchain Week アドバイザーも兼任。</p><hr><p>​【English Guide】</p><p>​​Organizers: <a target="_blank" rel="nofollow noopener" href="https://web3salon.or.jp/?utm_source=luma">Web3 Salon</a> | <a target="_blank" rel="nofollow noopener" href="https://asiaweb3alliance.jp/?utm_source=luma">Asia Web3 Alliance Japan (AWAJ) </a>&amp; JETRO and <a target="_blank" rel="nofollow noopener" href="https://navenue.jp/?utm_source=luma">N.Avenue</a>, Inc. (<a target="_blank" rel="nofollow noopener" href="https://www.coindeskjapan.com/?utm_source=luma">CoinDesk JAPAN)</a></p><p>​​Event Type: Panel Discussion + Networking Session</p><p>​​Event Overview Join us for an exclusive Web3 investment-focused side event during IVS Kyoto 2025, hosted by Web3 Salon, Asia Web3 Alliance Japan (AWAJ), JETRO, and N.Avenue, Inc. (CoinDesk JAPAN). This session brings together leading investors, founders, and ecosystem builders to explore where capital, conviction, and innovation are converging in the Web3 space.</p><p>​​From global VC trends to Japanese regulatory insights, this event offers rare perspectives on what’s driving smart money—and what founders should know to build trusted, fundable, and scalable projects.</p><p>​</p><p>​​Event Details<br>📅 Date: Thursday, July 3rd, 2025<br>🕒 Time: 14:300–16:50 JST. Please note the updated start time.<br>📍 Venue: Kyoto Keizai Center 3rd Floor – KOIN<br>🎤 Format: Panel Discussion + Networking<br>👥 Audience: Web3 founders, investors, accelerators, corporates, media<br>🪑 Capacity: 80–100 guests (Pre-registration required)</p><p>​</p><p>​<strong>🗓 Agenda</strong></p><p>​<strong>14:30 – 15:00</strong> | Registration &amp; Welcome – Hinza Asif<br><strong>15:00 – 15:05</strong> | Opening Remarks &amp; JETRO Presentation<br><strong>15:05 – 15:10</strong> | Introduction to Web3 Salon – Hinza Asif<br><strong>15:10 – 15:20</strong> | Ripple’s Progress in Japan under Web3 Salon&nbsp; – Takashi Shimoyama<br>General Manager, Sales &amp; Customer Success Division, SBI Ripple Asia Co., Ltd.<br>After working at a securities firm in Japan and the US and managing an investment company, he joined SBI Ripple Asia. He is promoting business development including tokenization of real assets (RWA) and alliances with external partners in the field of international remittances.<br><br><strong>15:20 – 15:30</strong> || Coindesk<strong> / </strong>N.Avenue<br><strong>15:30 – 16:15</strong> | <strong>Panel Discussion:</strong><br>Topic: Investor Alpha: Where Smart Money Is Flowing in Web3<br>Speakers:</p><ul><li><p>​<strong>Jonathan M. Hayashi</strong>, Headline Asia</p></li><li><p>​<strong>Yutaro Hiyama</strong>, Director, HIRAC FUND / Money Forward Venture Partners Inc.</p></li><li><p>​<strong>Ryosuke Ushida</strong>, Director of the Innovation Promotion Office &amp; Chief Fintech Officer, Financial Services Agency<br><strong>Moderator:</strong> <strong>Yuki Kamimoto</strong>, CEO, N.Avenue Inc. (Language: Japanese)</p></li></ul><p>​<strong>16:15 – 16:50</strong> | Networking &amp; Drinks</p><h2><strong>​🎙️ Speakers</strong></h2><p>​<strong>Jonathan M. Hayashi</strong></p><p>​<strong>Partner, Headline Asia</strong><br>Born in Japan and raised in China. Holds dual degrees in Financial Economics and Optical Engineering from the University of Rochester. After starting his career in investment banking at SMBC Nikko Securities, he moved to SBI Investment, where he led over 30 investments in Fintech and Blockchain.<br><br><br><strong>Ryosuke Ushida</strong></p><p>​<strong>Director, Innovation Promotion Office &amp; Chief Fintech Officer, Financial Services Agency (Japan)</strong><br>Joined the FSA in 2010. Leads innovation promotion policy, especially related to AI and blockchain. He co-chairs the FATF Crypto Assets Contact Group, contributing to international AML/CFT rule-making. He previously conducted research on decentralized finance governance at Georgetown University. Holds degrees from the University of Tokyo (Engineering) and London Business School (MSc in Finance).</p><p>​<strong>Yuki Kamimoto</strong></p><p>​<strong>CEO, N.Avenue Inc. (CoinDesk JAPAN)</strong><br>Joined Yahoo Japan in 2013 and was involved in media and advertising business development. Founded N.Avenue Inc. in 2018 to operate Web3 media services, later spinning it out independently. Oversees CoinDesk JAPAN, the official Japanese version of the leading global Web3 media, and N.Avenue Club, Japan's largest Web3 business community. She also serves as Director of the Blockchain Promotion Association (BCCC) and Advisor to Japan Blockchain Week.</p><p><strong>Location</strong></p><p><strong>京都経済センター３階 KOIN Kyoto Keizai Center 3rd floor - KOIN</strong></p>	2025-07-03	14:30 – 16:50 (JST)	京都経済センター３階 KOIN (Kyoto Keizai Center 3rd floor – KOIN), Kyoto, Japan	/images/037669b3-2b2c-4bdd-ac2d-efcd2390ac30-d3cc9733.avif	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:41:47.9297+00	\N	[]	[]	https://luma.com/dlf7w9pc	Request to Join	Web3 investment side event at IVS Kyoto 2025	Kyoto Keizai Center (3rd Floor – KOIN)	\N	\N	[]	[]
16	XRPL Japan Community Day + DEMO DAY（賞金10,000 USD） | Web3 Salon	xrpl-japan-community-day-demo-day10000-usd-web3-salon	XRPL Japan and Web3 Salon are hosting a Community Day & Demo Day on Saturday, June 21, 2025. With doors opening at 13:30 and the programme starting at 14:00, the event welcomes XRP holders, creators, developers and anyone curious about the XRPL ecosystem. Attendance is free and limited to 100 in‑person guests. Unlike typical developer‑oriented events, this gathering aims to create a space where all members of the XRPL community can connect and collaborate. Participants will watch live pitches by XRPL Japan Hackathon finalists as the winners are decided on the spot, enjoy sessions from guest speakers, network with fellow attendees and receive exclusive event	<p>*English follows</p><p>​*This event will be held in Japanese.</p><p>​<em>*Hackathonの概要はCommunity Dayの次に記載があります</em></p><p><strong>​[Community Day + DEMO DAY]</strong></p><p>​来る6月21日（土）、「XRPL Japan Community Day + DEMO DAY」を開催致します！</p><p>​XRPホルダー、クリエイター、興味がある人など、どなたでもウェルカムです！</p><p>​<strong>来場者には大人気NFTクリエイターによるNFTをランダムミントで三点プレゼント！！！！</strong></p><p>​<strong>さらに先着50名様にはXRPL Japan Tシャツプレゼントもあります！</strong></p><p>​通常の開発者向けイベントやホルダー向けイベントとは異なり、XRPL Japanは、XRPLに関わるすべての人が集い、交流できる場を提供することを目的としています。</p><p>​イベント中にはXRPL Japan Hackathonの<strong>ファイナリストたちによる熱いピッチ</strong>が目の前で繰り広げられ、<strong>受賞プロジェクトがその場で決定！</strong></p><p>​さらに、登壇ゲストによるセッション、交流会、限定ノベルティなど、1日限りの特別な体験をお届けします。</p><p>​皆様のご参加をお待ちしております。</p><h2><strong>​イベント概要</strong></h2><p>​📅 2025年6月21日(土)<br>​​🕑 14:00 - 18:00 (13:30 受付開始)<br>📍 〒107-6006 東京都港区赤坂1丁目12-32 アーク森ビル 7F<br>　 JETRO本部7階 イノベーションガーデン<br>　 <a target="_blank" rel="nofollow noopener" href="https://www.jetro.go.jp/jetro/profile/map.html?utm_source=luma">アクセスマップ</a></p><p>​<br>規定人数に達した場合は、自動的にWaiting Listに追加（キャンセル待ち）となりますのでご了承ください。<br>当日は、<strong>事前にお申し込みいただいた方を対象に受付確認を行います。</strong></p><hr><h2><strong>​<br>プログラム</strong></h2><p>​14:00 -15:00 Web3 Salon、SBI Ripple Asia、DSRV、Mercoinによる登壇<br>14:50 - 15:50 XRPLハッカソン・ファイナリストによるピッチ<br>15:50 - 16:00 Doppler Finance Keynote Session<br>16:00 - 16:15 受賞者発表🏆<br>16:15 - 18:00 コミュニティ交流会</p><hr><p><strong>​[Hackathon]</strong></p><p>​XRPL Japan主催のハッカソンを開催します！</p><p>​<strong>エントリーと詳細はこちらから→ </strong><a target="_blank" rel="noopener noreferrer" href="https://app.akindo.io/hackathons/27WABBdmRUvvOr1m"><strong>https://app.akindo.io/hackathons/27WABBdmRUvvOr1m</strong></a></p><p>​審査員にはXRPL Koreaも参加予定。初心者からプロのエンジニアまで参加できる多様なトラックをご用意しています。</p><h2><strong>​◼︎スケジュール</strong></h2><p>​以下の日程で開催されます。<br><br>- 2025年05年10日（土）エントリー開催<a target="_blank" rel="noopener noreferrer" href="https://app.akindo.io/hackathons/27WABBdmRUvvOr1m">https://app.akindo.io/hackathons/27WABBdmRUvvOr1m</a></p><p>​- 2025年05年30日（金）20:00 JST キックオフ<br>オンライン開催しますので、エントリーをしてその詳細をお待ちください。<br><a target="_blank" rel="noopener noreferrer" href="https://lu.ma/gtq1m9em">https://lu.ma/gtq1m9em</a></p><p>​- 2025年06年16日（月）09:59 JST 提出期限<br>提出はこちらから <a target="_blank" rel="noopener noreferrer" href="https://app.akindo.io/hackathons/27WABBdmRUvvOr1m">https://app.akindo.io/hackathons/27WABBdmRUvvOr1m</a></p><p>​- 2025年06年18日（水） ファイナリスト発表</p><p>​- 2025年06年21日（土）13:30 JST<br>Community Day会場でファイナリストによるピッチ 、表彰</p><h2><strong>​<br>◼︎トラック &amp; 賞金</strong></h2><p>​<strong><em>アイデアに制限はありません</em></strong>が、インスピレーションと指針となるいくつかの提案をご用意しました。</p><p>​皆さんが生み出す革新的な作品を楽しみにしています！😊</p><p>​<strong>🏆 XRPL Deep Track (Prize: 1,000 XRP)</strong></p><p>​XRPL ネイティブ機能活用</p><p>​<strong>🏆 Xahau Track (Prize: 100,000 XAH)</strong></p><p>​Xahau Networkでスマートコントラクト「Hooks」などの開発</p><p>​<strong>🏆 AI × XRPL Track (Prize: 650 XRP)</strong></p><p>​LangChain / Vibe Coding など</p><p>​<strong>🏆 Student &amp; Beginners Track (Prize: 325 XRP)</strong></p><p>​SDK テンプレで初 Web3</p><p>​<strong>🏆 コミュニティ賞 (Prize: 150 XRP)</strong></p><p>​コミュニティ投票</p><p>​※ 賞金は、各トラックの入賞チームに分配されます。なお、入賞チームの数については現在調整中です。<br></p><hr><p><strong>​審査員</strong></p><p>​</p><h2><strong>​Q</strong></h2><p>​<a target="_blank" rel="noopener noreferrer" href="https://x.com/_tequ_">https://x.com/_tequ_</a><br><br>XRP LedgerおよびXahau Networkのコントリビュータ<br>グローバルな開発者コミュニティに参画し、プロトコルの改善提案や不具合修正などに取り組む</p><p>​<strong>増田　健太郎</strong><br><a target="_blank" rel="noopener noreferrer" href="https://x.com/0xpokotaro">https://x.com/0xpokotaro</a><br><br>Web3 Developer 一般社団法人XRPL Japan 理事。<br><br>2024年よりXRPLの普及・教育・国内Web3エコシステム推進に取り組み、2020年よりフリーランスエンジニアとして暗号資産「RiceCake」を開発。<br>2018年〜2019年 METATEAM株式会社で社内通貨開発、2009年〜2018年 光通信グループでエリアマネージャーを歴任。<br><br><strong>スキル</strong>: ブロックチェーン（Ethereum/XRPL/BSC）、スマートコントラクト、フルスタック開発（React/Node.jsAWS）、SESマネジメント。</p><p>​</p><p>​<strong>Mai</strong><br><a target="_blank" rel="noopener noreferrer" href="https://x.com/Mai_XRPLJapan">https://x.com/Mai_XRPLJapan</a></p><p>​XRPL Japan共同設立者、XRPL Labs<br><br>XRP Ledgerの日本コミュニティ活性化を目指し、有志とともに「XRPL Japan」を共同設立。XRPLウォレット「Xaman」でサポート業務に携わるかたわら、国内でのXRP Ledgerの普及・導入促進に向けて活動中。</p><p>​</p><p>​Jake Ku<br><a target="_blank" rel="noopener noreferrer" href="https://x.com/noDoubt_it">https://x.com/noDoubt_it</a><br><a target="_blank" rel="noopener noreferrer" href="https://x.com/xrplkorea">https://x.com/xrplkorea</a></p><p>​XRPL Korea &amp; Catalyze Research, DevRel<br>Hashed Open Research, RA<br>Korea Development Bank(KDB Bank), RA Intern<br>Industrial Bank of Korea(IBK Bank), Intern</p><p>​Jake is the DevRel at XRPL Korea &amp; Catalyze Research, where he leads community-driven efforts to grow the XRP Ledger ecosystem in South Korea by supporting local developers, fostering partnerships, and connecting builders to global opportunities.</p><p>​</p><h2><strong>​<br>ハッカソンの詳細・参加申し込みはこちらから（AKINDO）⬇️</strong></h2><p>​<a target="_blank" rel="noopener noreferrer" href="https://app.akindo.io/hackathons/27WABBdmRUvvOr1m">https://app.akindo.io/hackathons/27WABBdmRUvvOr1m</a></p><p>​</p><p><strong>​Hosts</strong></p><hr><p>​<strong>一般社団法人XRPL Japan</strong>（<a target="_blank" rel="noopener noreferrer" href="https://xrpl.jp/">https://xrpl.jp/</a>）</p><p>​About <strong>Web3 Salon:</strong><br>Web3 Salon is a joint project of<a target="_blank" rel="nofollow noopener" href="https://asiaweb3alliance.jp/?utm_source=luma"> Asia Web3 Alliance Japan </a>and JETRO, connecting Web3 entrepreneurs, investors, and innovators to share knowledge and foster collaboration.<br><a target="_blank" rel="noopener noreferrer" href="https://web3salon.or.jp/">https://web3salon.or.jp/</a></p><p>​<br><br><strong>About JETRO (Japan External Trade Organization)</strong>: is a Japanese government-related organization that promotes trade and investment between Japan and the global market. It supports businesses by providing information, resources, and services to help them expand internationally, attract foreign investments, and strengthen global partnerships.<br><a target="_blank" rel="noopener noreferrer" href="https://www.jetro.go.jp">https://www.jetro.go.jp</a></p><p><strong>​パートナー・スポンサー</strong></p><hr><p>​<strong>Xaman</strong>（<a target="_blank" rel="noopener noreferrer" href="https://xaman.app/">https://xaman.app/</a>）</p><p>​<strong>DSRV labs.</strong>（<a target="_blank" rel="noopener noreferrer" href="https://dsrv.com/">https://dsrv.com/</a>）</p><p>​<strong>SBI Ripple Asia </strong>(<a target="_blank" rel="noopener noreferrer" href="https://ripple.com/company/sbi-ripple-asia/">https://ripple.com/company/sbi-ripple-asia/</a>)</p><p>​<br><strong>AKINDO</strong> (<a target="_blank" rel="noopener noreferrer" href="https://akindo.io/">https://akindo.io/</a>)</p><p>​</p><p>​Mercoin (<a target="_blank" rel="noopener noreferrer" href="https://about.mercoin.com/">https://about.mercoin.com/</a>)</p><p><strong>​<br><br>コミュニティパートナー</strong></p><hr><p>​<strong>META AKITA</strong> (<a target="_blank" rel="noopener noreferrer" href="https://akitainu-hozonkai.com/metaakita/">https://akitainu-hozonkai.com/metaakita/</a>)</p><p>​博報堂KEY3 (<a target="_blank" rel="noopener noreferrer" href="https://www.key3.co.jp/">https://www.key3.co.jp/</a>)</p><p>​Ginco (<a target="_blank" rel="noopener noreferrer" href="https://www.ginco.com/">https://www.ginco.com/</a>)</p><p>​</p><p><strong>​ENGLISH</strong></p><p>​<strong>XRPL Jpan / Web3 Salon</strong> will host the <strong>“XRPL Japan Hackathon”</strong> and <strong>“XRPL Japan Community Day + DEMO DAY”!</strong></p><p>​(*Details for Hackathon follow the Community Daysection.)</p><p>​</p><p><strong>​[Community Day + DEMO DAY]</strong></p><p>​"The Community Day + DEMO DAY" will be held on <strong>Saturday, June 21, 2025</strong>, with doors opening at <strong>13:30 JST</strong> and the event starting at <strong>14:00 JST</strong>.</p><p>​The venue is the <strong>Innovation Garden, 7F, JETRO HQ</strong> (see map below).</p><p>​Whether you’re an XRP holder, creator, developer, or just curious — <strong>everyone is welcome!</strong></p><p>​✅ <strong>100-person capacity</strong></p><p>​✅ <strong>Free admission</strong></p><p>​✅ <strong>In-person only</strong></p><p>​Unlike typical dev- or holder-focused events, XRPL Japan’s goal is to create a space where everyone involved with XRPL can connect and collaborate.</p><p>​At the event, you’ll get to witness <strong>live finalist pitches</strong> from the XRPL Japan Hackathon, and <strong>winners will be announced on the spot!</strong></p><p>​</p><p>​You’ll also enjoy:</p><ul><li><p>​Sessions by guest speakers</p></li><li><p>​Community networking</p></li><li><p>​Exclusive event goodies 🎁</p></li></ul><hr><h2><strong>​Event Details:</strong></h2><p>​📅 <strong>June 21, 2025 (Sat)</strong></p><p>​🕑 <strong>14:00 – 18:00 JST</strong> (Doors open at 13:30)</p><p>​📍 <em>Innovation Garden, 7F JETRO HQ</em></p><p>​Ark Mori Building, 1-12-32 Akasaka, Minato-ku, Tokyo 107-6006</p><p>​</p><p>​⚠️ Once capacity is reached, attendees will automatically be placed on a <strong>waiting list</strong>.</p><p>​Only those who registered in advance will be admitted at the door.</p><p>​</p><hr><p>​<strong>Program (Tentative)</strong></p><p>​<em>Please note the schedule is still being finalized and may be subject to change.</em></p><ul><li><p>​Guest speaker sessions</p></li><li><p>​Finalist pitches &amp; awards ceremony 🏆</p></li><li><p>​Community networking session</p></li></ul><p>​</p><p>​We look forward to seeing you there! 🎉</p><p>​</p><p><strong>​[Hackathon]</strong></p><h2><strong>​◼︎ Schedule</strong></h2><p>​The event will take place on the following dates:</p><ul><li><p>​<strong>June 1, 2025 (Sun) 12:00 JST</strong> – Kickoff (online)</p></li><li><p>​<strong>June 16, 2025 (Mon) 09:59 JST</strong> – Submission deadline</p></li><li><p>​<strong>June 18, 2025 (Wed)</strong> – <em>Finalist announcement (TBD)</em></p></li><li><p>​<strong>June 21, 2025 (Sat) 13:30 JST</strong> – Finalist pitch and awards at the Community Day venue</p></li></ul><hr><h2><strong>​◼︎ Tracks &amp; Prizes</strong></h2><p>​There are no restrictions on ideas, but we’ve provided a few suggested tracks to help spark your creativity.</p><p>​We’re excited to see the innovative projects you’ll create! 😊</p><h2><strong>​🏆 Tracks</strong></h2><p>​<strong>&lt;Description&gt;</strong></p><p>​<strong>🏆 XRPL Deep Track (Prize: 1,000 XRP)</strong></p><p>​Utilizing native XRPL features</p><p>​<strong>🏆 Xahau Track (Prize: 100,000 XAH)</strong></p><p>​Building on Xahau Network (e.g. Hooks smart contracts)</p><p>​<strong>🏆 AI × XRPL Track (Prize: 650 XRP)</strong></p><p>​Projects using LangChain, Vibe Coding, etc.</p><p>​<strong>🏆 Student &amp; Beginners Track (Prize: 325 XRP)</strong></p><p>​Intro to Web3 using SDK templates</p><p>​<strong>🏆 Community Award (Prize: 150 XRP)</strong></p><p>​Voted by the community</p><p>​</p><p>​<em>Prizes will be distributed among the winning teams in each track. The number of awardees is still being finalized.</em></p><p>​</p><p>​📄 Full details (via AKINDO):</p><p>​<a target="_blank" rel="noopener noreferrer" href="https://app.akindo.io/hackathons/27WABBdmRUvvOr1m">https://app.akindo.io/hackathons/27WABBdmRUvvOr1m</a></p><p>​</p><hr><p><strong>​</strong></p><hr><p><strong>​Hosts</strong></p><hr><p>​<strong>一般社団法人XRPL Japan</strong>（<a target="_blank" rel="noopener noreferrer" href="https://xrpl.jp/">https://xrpl.jp/</a>）</p><p>​About <strong>Web3 Salon:</strong><br>Web3 Salon is a joint project of<a target="_blank" rel="nofollow noopener" href="https://asiaweb3alliance.jp/?utm_source=luma"> Asia Web3 Alliance Japan </a>and JETRO, connecting Web3 entrepreneurs, investors, and innovators to share knowledge and foster collaboration.<br><a target="_blank" rel="noopener noreferrer" href="https://web3salon.or.jp/">https://web3salon.or.jp/</a></p><p>​<br><br><strong>About JETRO (Japan External Trade Organization)</strong>: is a Japanese government-related organization that promotes trade and investment between Japan and the global market. It supports businesses by providing information, resources, and services to help them expand internationally, attract foreign investments, and strengthen global partnerships.<br><a target="_blank" rel="noopener noreferrer" href="https://www.jetro.go.jp">https://www.jetro.go.jp</a></p><p><strong>​パートナー・スポンサー</strong></p><hr><p>​<strong>Xaman</strong>（<a target="_blank" rel="noopener noreferrer" href="https://xaman.app/">https://xaman.app/</a>）</p><p>​<strong>DSRV labs.</strong>（<a target="_blank" rel="noopener noreferrer" href="https://dsrv.com/">https://dsrv.com/</a>）</p><p>​<strong>SBI Ripple Asia </strong>(<a target="_blank" rel="noopener noreferrer" href="https://ripple.com/company/sbi-ripple-asia/">https://ripple.com/company/sbi-ripple-asia/</a>)</p><p>​<strong>AKINDO</strong> (<a target="_blank" rel="noopener noreferrer" href="https://akindo.io/">https://akindo.io/</a>)</p><p>​</p><p><strong>​コミュニティパートナー</strong></p><p>​</p><p>​<strong>META AKITA</strong> (<a target="_blank" rel="noopener noreferrer" href="https://akitainu-hozonkai.com/metaakita/">https://akitainu-hozonkai.com/metaakita/</a>)</p><p>​HAKUHODO KEY3 (<a target="_blank" rel="noopener noreferrer" href="https://www.key3.co.jp/">https://www.key3.co.jp/</a>)</p><p><strong>Location</strong></p><p><strong>Ark Mori Bldg.</strong></p><p>Ark Mori Building, 1-chōme-12-32 Akasaka, Minato City, Tokyo 107-6090, Japan</p>	2025-06-21	14:00 – 18:00 (JST) (doors open at 13:30)	Ark Mori Building, 1‑12‑32 Akasaka, Minato‑ku, Tokyo 107‑6006, Japan	/images/8bdce400-0161-4159-b24f-42b5e3db4262-dbf953c3.avif	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:47:30.947688+00	\N	[]	[]	https://luma.com/f6sqrx4j	Register	Community celebration and Hackathon finalist showcase with $10,000 prize	Innovation Garden, 7F JETRO HQ	\N	\N	[]	[]
12	Ripple x Web3Salon: The Future of Finance – Tokenization & Institutional DeFi in Japan	ripple-x-web3salon-the-future-of-finance-tokenization-institutional-defi-in-japa	Join Ripple and Web3 Salon for a half‑day side event during WebX Tokyo 2025. Supported by JETRO and hosted at FINOLAB, it gathers innovators, founders, corporate leaders and investors to explore how tokenization and institutional DeFi are reshaping the global financial stack, with a special focus on Japan’s unique role. Attendees can dive deep into the XRP Ledger (XRPL), learn institutional DeFi use cases, and network with top fintech startups and stakeholders	<p>​■ 対象者<br>-フィンテックスタートアップの創業者<br>-デジタル資産／金融分野に携わる企業関係者<br>-フィンテックおよびデジタルアセット関連のベンチャーキャピタル関係者<br><br>■ 定員：100名（※お早めのご登録をおすすめします）</p><p>​<a target="_blank" rel="nofollow noopener" href="https://ripple.com/insights/unlocking-innovation-in-japan/?utm_source=luma">Ripple</a>と<a target="_blank" rel="nofollow noopener" href="https://web3salon.or.jp/?utm_source=luma">Web3 Salon</a>（<a target="_blank" rel="nofollow noopener" href="https://www.jetro.go.jp/?utm_source=luma">JETRO［日本貿易振興機構</a>］の支援による取り組み）に、<a target="_blank" rel="nofollow noopener" href="https://finolab.tokyo/?utm_source=luma">FINOLAB Tokyo </a>をパートナーとして迎え、<a target="_blank" rel="nofollow noopener" href="https://webx-asia.com/?utm_source=luma">WebX Tokyo 2025</a>期間中に開催される特別なサイドイベントにぜひご参加ください。本イベントでは、次世代の金融を形作るイノベーター、起業家、企業リーダー、投資家が一堂に会し、トークン化や機関投資家向けDeFiがグローバルな金融インフラをどのように再構築しているかをテーマに、特に日本がこの分野で果たすユニークな役割に焦点を当てた議論が展開されます。</p><p>​創業者、投資家、政策立案者など、どのような立場の方にとっても、XRP Ledger（XRPL）を深く知り、機関投資家向けDeFiの活用事例を学び、先進的なフィンテックスタートアップや業界関係者と交流できる貴重な機会となっています。<br><br><strong>アジェンダ</strong></p><p>​<strong>​</strong>14:30～15:00<strong> - 受付開始・開場</strong><br>ウェルカムネットワーキング（軽食・お飲み物をご用意しております）名札の受け取りとともに、音楽とともにリラックスした雰囲気の中で交流をお楽しみください。</p><p>​​15:00～15:20 - オープニング挨拶<br>主催：Ripple、Web3 Salon、JETRO</p><p>​- JETROによる今後のスタートアップ支援プログラムのご紹介</p><p>​-Rippleより挨拶：トークン化と機関投資家向け金融の未来について<br>-暗号資産を起点としたツールが世界の金融基盤に</p><p>​15:20～15:35<br>Ripple プレゼンテーション：「RippleおよびXRPL助成金プログラムのご紹介」<br>Rippleのミッションや、機関投資家向けDeFiを支える製品群、そしてXRP Ledger（XRPL）がいかにしてグローバルな金融イノベーションを可能にしているかについてご紹介します。​<br>XRPL Grants の活用方法や支援体制、応募の機会についてご案内いたします。</p><p>​​15:35～16:00<br><strong>フィンテックスタートアップのための XRPL テクノロジーワークショップ</strong><br>XRPL上で金融プロダクトを構築する手軽さを体験</p><p>​-実演形式で学ぶ：XRPLを使ったサービス立ち上げの流れ<br>-開発に必要なツール・SDK・APIのご紹介<br>-XRPLの強み：スピード、拡張性、規制対応、環境配慮<br>-開発者向けサポートおよび助成金プログラムのご案内<br><br>16:00～16:45 - パネルディスカッション:<br>「金融の未来 ― 日本におけるトークン化と機関投資家向けのDeFi」日本が牽引する実世界資産（RWA）のトークン化および機関向けブロックチェーンインフラの最前線について議論します。<br><br>主なテーマ:</p><p>​-​機関投資家向けDeFiの展開時期と導入の見通し<br>-企業向け実世界資産（RWA）のトークン化<br>-規制とコンプライアンスの視点（パブリックチェーン vs プライベートチェーン）<br>-トークン化された金融の未来を日本がいかにリードしているか</p><p>​<strong>【スピーカー】</strong></p><p>​<strong>1- マネーフォワードベンチャーパートナーズ株式会社　檜山様</strong><br><strong>2- </strong>TOYOTA Blockchain Lab<strong> 川村様</strong><br>3- <strong>三井住友信託銀行株式会社&nbsp;兼&nbsp;Trust Base株式会社　池野様</strong></p><p>​<strong>【モデレーター】 ・SBI Ripple Asia株式会社　下山様</strong></p><p>​</p><p>​16:45～17:00<br><strong>フィンテックスタートアップ ピッチショーケース</strong>最先端のブロックチェーン技術を活用したフィンテックソリューションを提案する、2〜3社のスタートアップによるピッチをご覧いただきます。<br>各社：4分間のプレゼンテーション + 1分間の質疑応答<br>1- JPYC<br>2-Myna Wallet<br>3-Rinne<br>4-Laplace</p><p>​17:00～17:45<br>ネットワーキング &amp; ドリンク：「つながり、共創する時間」<br>お飲み物を片手に、登壇者や参加者との有意義な交流をお楽しみください。</p><p>​-RippleXチーム、登壇者、業界のイノベーターたちと交流<br>- 名刺交換スペースもご用意していますので、新たなご縁づくりにもぜひご活用ください<br>-参加無料（定員100名）※事前申込制／先着順となりますので、お早めにご登録ください。</p><p>​​主催：<br>Asia Web3 Alliance Japan（Web3Salon）<br>Ripple<br>協力：JETRO（日本貿易振興機構）<br>パートナー：<a target="_blank" rel="nofollow noopener" href="https://finolab.tokyo/?utm_source=luma">FINOLAB Tokyo&nbsp;</a>|　Singapore Global Network（シンガポール経済開発庁［EDB］）</p><hr><p>​<br>Overview</p><p>​Join <a target="_blank" rel="nofollow noopener" href="https://ripple.com/insights/unlocking-innovation-in-japan/?utm_source=luma">Ripple</a> and <a target="_blank" rel="nofollow noopener" href="https://web3salon.or.jp/?utm_source=luma">Web3Salon</a> Supported by <a target="_blank" rel="nofollow noopener" href="https://www.jetro.go.jp/?utm_source=luma">JETRO</a> (Japan External Trade Organization) and partnered with <a target="_blank" rel="nofollow noopener" href="https://finolab.tokyo/?utm_source=luma">FINOLAB, Tokyo</a> for an exclusive side event during <a target="_blank" rel="nofollow noopener" href="https://webx-asia.com/?utm_source=luma">WebX Tokyo 2025</a>, bringing together innovators, founders, corporate leaders, and investors shaping the next era of finance. This half-day session brings together leading voices to explore how tokenization and institutional DeFi are reshaping the global financial stack, with a spotlight on Japan’s unique position in the ecosystem.</p><p>​Whether you're a builder, founder, investor, or policymaker, this is your chance to explore XRP Ledger (XRPL), understand institutional DeFi use cases, and connect with top fintech startups and stakeholders.<br><br>Who Should Attend</p><ul><li><p>​Fintech Startup Founders</p></li><li><p>​Corporate Professionals in Digital Assets/Finance</p></li><li><p>​Fintech &amp; Digital Asset VCs<br><strong>Capacity:</strong> 100 participants (Register early to secure your spot)</p></li></ul><p>​Agenda</p><p>​<strong>2:30 PM – 3:00 PM</strong><br><strong>Doors Open &amp; Registration</strong><br>Welcome networking over refreshments, badge pickup, and music to set the tone.</p><p>​<strong>3:00 PM – 3:20 PM</strong><br><strong>Opening Remarks</strong><br>Hosted by Ripple, Web3Salon &amp; JETRO</p><ul><li><p>​Introduction to JETRO’s upcoming startup support program</p></li><li><p>​Welcome note from Ripple on the future of tokenization and institutional-grade finance</p></li><li><p>​Vision framing: <em>“From crypto-native tools to global financial infrastructure”</em></p></li></ul><p>​<strong>3:20 PM – 3:35 PM</strong><br><strong>Ripple Presentation: “Introduction to Ripple and the XRPL Grants Program”</strong><br>Learn about Ripple’s mission, the products powering institutional DeFi, and how XRPL is enabling global financial innovation.</p><ul><li><p>​Explore XRPL Grants: opportunities, structure, and builder support.</p></li></ul><p>​<strong>3:35 PM – 4:00 PM</strong><br><strong>XRPL Technology Workshop for Fintech Startups</strong><br><em>Hosted by Tequ</em><br>Discover how easy it is to build financial products on XRPL.</p><ul><li><p>​Step-by-step demo: Launching on XRPL</p></li><li><p>​Tools, SDKs, APIs overview</p></li><li><p>​Benefits of XRPL: speed, scalability, compliance, and energy efficiency</p></li><li><p>​Developer support and grants</p></li></ul><p>​<strong>4:00 PM – 4:45 PM</strong><br><strong>Panel Discussion:</strong><br><strong>“The Future of Finance: Tokenization &amp; Institutional DeFi in Japan”</strong><br>Explore Japan’s leadership in RWA tokenization and institutional blockchain infrastructure.<br><strong>Key Themes:</strong></p><ul><li><p>​Institutional DeFi and its adoption timeline</p></li><li><p>​Real-world asset (RWA) tokenization for enterprises</p></li><li><p>​Regulatory and compliance insights (public vs. private chains)</p></li><li><p>​How Japan is shaping the tokenized finance future</p></li></ul><p>​<strong>[Speakers]</strong></p><ol><li><p>​Mr. Hiyama, <strong>Money Forward Venture Partners, Inc.</strong></p></li><li><p>​Mr. Kawamura, TOYOTA Blockchain Lab</p></li><li><p>​Mr. Ikeno,<strong> Sumitomo Mitsui Trust Bank, Limited and Trust Base Co., Ltd</strong>.</p></li></ol><p>​<strong>[Moderators] </strong>・Mr. Shimoyama, <strong>SBI Ripple Asia Co., Ltd</strong>.</p><p>​<strong>4:45 PM – 5:00 PM</strong><br><strong>Fintech Startup Pitch Showcase: “Rebuilding Finance On-Chain”</strong><br>Watch 4 startups pitch cutting-edge blockchain-based fintech solutions.</p><ul><li><p>​4-minute pitch + 1-minute Q&amp;A<br>1- JPYC<br>2-Myna Wallet<br>3-Rinne<br>4-Laplace</p></li></ul><p>​<strong>5:00 PM – 5:45 PM</strong><br><strong>Networking &amp; Drinks: “Connect &amp; Collaborate”</strong><br>Enjoy drinks and meaningful conversations.</p><ul><li><p>​Meet the RippleX team, speakers, and fellow innovators</p></li><li><p>​Business card exchange area for new connections</p></li></ul><p>​🎫 Limited to 100 participants. Reserve your seat now.</p><p>​Organized by<br><strong>Asia Web3 Alliance Japan (Web3Salon)</strong><br><strong>Ripple</strong><br><strong>Supported by JETRO</strong></p><p>​Partnered with FINOLAB Tokyo and Singapore Global Network (SGN) - Singapore Economic Development Board (EDB)</p><p><strong>Location</strong></p><p><strong>FINOLAB</strong></p><p>Japan, 〒100-0004 Tokyo, Chiyoda City, Ōtemachi, 1-chōme−6−１ Otemachi Bldg., 4F</p>	2025-08-28	3:00 PM – 6:00 PM (JST)	1‑chōme‑6‑1 Ōtemachi, Otemachi Bldg., 4F, Chiyoda City, Tokyo 100‑0004, Japan	/images/d3875734-d9db-4fb9-9406-4ecd77a8fb57-1e10fae7.avif	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:29:13.582926+00	\N	[]	[]	https://luma.com/spsw52hq	Join Waitlist	Exclusive side event at WebX Tokyo 2025	FINOLAB	\N	\N	[]	[]
11	FinTech Startup Connect – Ripple X Web3 Salon @ Global Startup Expo Osaka & EDCON Osaka	fintech-startup-connect-ripple-x-web3-salon-global-startup-expo-osaka-edcon-osak	Osaka, Japan—An official side event of Global Startup Expo 2025 and EDCON Osaka 2025, this gathering spotlights Japan’s most innovative Web3 and FinTech startups. Co‑organized by Ripple, JETRO and Web3 Salon, it connects Japanese Web3 and FinTech startups with global founders, venture capitalists and accelerators, showcasing how blockchain, tokenization and FinTech innovation are shaping the future of finance. More than a networking event, it acts as a global bridge linking Japanese startups with international investors and partners, strengthening Osaka’s role as a hub for Web3 and FinTech entrepreneurship	<p><strong>大阪・日本</strong> – 本イベントは、<strong>Global Startup Expo 2025</strong> および <strong>EDCON Osaka 2025（Ethereum Community Conference）</strong> の公式サイドイベントとして開催され、日本の最先端Web3・FinTechスタートアップにスポットライトを当てます。</p><p>​<strong>本企画はAsia Web3 Alliance Japanを主体として、Web3 Salon、Ripple、JETRO</strong>の共催により、日本のWeb3・FinTechスタートアップと世界の起業家、ベンチャーキャピタル、アクセラレーターをつなぎ、ブロックチェーン、トークン化、そしてFinTechのイノベーションが金融の未来をいかに形作っているかを紹介します。</p><p>​このイベントは単なる交流の場ではありません。日本のFinTechスタートアップと国際的な投資家・パートナーを結ぶ<strong>グローバルな架け橋</strong>になります。RippleのグローバルネットワークとJETROの公的支援を背景に、大阪を拠点に日本のWeb3・FinTech起業のハブとしての地位を強化します。</p><p>​<strong>Global Startup Expo &amp; EDCON Osaka について</strong></p><ul><li><p>​<strong>Global Startup Expo 2025</strong> – 経済産業省（METI）、JETRO、新エネルギー・産業技術総合開発機構（NEDO）が主催し、日本および世界各国のスタートアップを集め、製品発表、投資家との交流、国際展開の機会を創出します。</p></li><li><p>​<strong>EDCON Osaka</strong> – 世界トップクラスのEthereumカンファレンスの一つであり、スタートアップに国際的なブロックチェーンおよびEthereumの開発者、研究者、起業家エコシステムへの直接的なアクセスを提供します。</p></li></ul><p>​本イベントは、グローバルな発信力を持つ<strong>Global Startup Expo 2025</strong>と、ブロックチェーンに注力した<strong>EDCON Osaka</strong>のサイドイベントとして、日本のFinTechおよびWeb3スタートアップにとって、認知度を高め、資金を呼び込み、長期的なパートナーシップを構築するためのまたとない機会を提供します。</p><p>​<strong>なぜこのイベントを開催するのか</strong></p><p>​<strong>FinTech &amp; Web3 Startup Connect</strong> は、日本国内外における伝統的な金融機関、FinTechスタートアップ、そしてWeb3エコシステムの間に存在するギャップを埋めることを目的としています。大阪は長らく金融とイノベーションの拠点として発展してきましたが、近年ではブロックチェーンやデジタル資産の中心地として急速に台頭しています。</p><p>​本イベントを開催することで、私たちが目指すことは、</p><ul><li><p>​<strong>日本のスタートアップの後押し</strong>：有望なFinTechおよびWeb3スタートアップに、製品やサービスを世界に発信する舞台を提供する。</p></li><li><p>​<strong>国際的な投資家の呼び込み</strong>：VC、アクセラレーター、グローバル投資家が、日本の起業家と直接つながるためのプラットフォームを構築する。</p></li><li><p>​<strong>金融とWeb3をつなぐ</strong>：銀行や決済事業者とブロックチェーンスタートアップの連携を促し、トークン化、ステーブルコイン、分散型金融（DeFi）の活用事例を加速させる。</p></li><li><p>​<strong>国境を越えた展開を支援</strong>：RippleやJETROといったパートナーの支援を通じて、スタートアップがグローバルに成長できるよう後押しする。</p></li></ul><p>​<strong>パートナー紹介</strong></p><p>​本イベントは、それぞれに強みを持つ有力なパートナーと共に創り上げられています。</p><ul><li><p>​<strong>Ripple</strong> – 「XRPL Japan &amp; Korea Fund」を通じて、日本におけるWeb3の普及を加速。スタートアップ支援、国際送金ソリューションの構築、トークン化の実現を推進しています。</p></li><li><p>​<strong>JETRO（日本貿易振興機構）</strong> – 政府系機関として、日本のスタートアップの海外展開を支援するとともに、海外企業を日本のエコシステムにつなぐ役割を担っています。</p></li><li><p>​<strong>Web3 Salon &amp; Asia Web3 Alliance Japan</strong> – 創業者、VC、企業をサポートし、アジア全域のWeb3エコシステムにおいて有意義なコラボレーションを生み出す、コミュニティ主導のネットワークです。</p></li></ul><p>​<strong>開催場所: QUINTBRIDGE (クイントブリッジ)</strong><br><strong>〒534-0024</strong><br><strong>大阪府大阪市都島区東野田町4丁目15番82号 QUINTBRIDGE 2階</strong></p><hr><p>​<strong>Osaka, Japan –</strong> An official side event of <strong>Global Startup Expo 2025</strong> and <strong>EDCON Osaka 2025 (Ethereum Community Conference)</strong> will spotlight Japan’s most innovative startups in <strong>Web3 and FinTech</strong>.</p><p>​Co-organized by <strong>Ripple, JETRO, and Web3 Salon</strong>, this event connects Japanese Web3 and Fintech startups with global founders, venture capitalists, and accelerators, showcasing how <strong>blockchain, tokenization, and FinTech innovation</strong> are shaping the future of finance.</p><p>​This is more than an event—it is a <strong>global bridge</strong> designed to link Japanese Fintech startups with international investors and partners. With Ripple’s global network and JETRO’s government-backed support, the event strengthens Japan’s position as a growing hub for <strong>Web3 and FinTech entrepreneurship in Osaka</strong>.</p><h2><strong>​About Global Startup Expo &amp; EDCON Osaka</strong></h2><ul><li><p>​<strong>Global Startup Expo 2025</strong> – Organized by METI, JETRO, and NEDO, the Expo gathers <strong>startups from across Japan and the world</strong>, creating opportunities to showcase products, connect with investors, and scale internationally.</p></li><li><p>​<strong>EDCON Osaka</strong> – One of the world’s leading <strong>Ethereum conferences</strong>, providing startups with <strong>direct access</strong> to the international blockchain and Ethereum ecosystem of developers, researchers, and entrepreneurs.</p></li></ul><p>​By combining the <strong>global reach of the Expo</strong> with the <strong>deep blockchain focus of EDCON</strong>, this side event provides an <strong>unmatched opportunity</strong> for Japanese FinTech and Web3 startups to gain visibility, attract capital, and build long-term partnerships.</p><h2><strong>​Why We Are Organizing This Event</strong></h2><p>​The <strong>FinTech &amp; Web3 Startup Connect</strong> is designed to bridge the gap between <strong>traditional financial institutions, FinTech startups, and the Web3 ecosystem</strong> in Japan and abroad. Osaka has long been a hub for finance and innovation, but the city is now rapidly emerging as a center for blockchain and digital assets. By hosting this event, we aim to:</p><ul><li><p>​<strong>Empower Japanese Startups</strong>: Give Japan’s most promising FinTech and Web3 startups a global stage to present their products and services.</p></li><li><p>​<strong>Attract International Investors</strong>: Create a platform where VCs, accelerators, and global investors can connect directly with founders in Japan.</p></li><li><p>​<strong>Bridge Finance &amp; Web3</strong>: Encourage collaboration between banks, payment companies, and blockchain startups to accelerate tokenization, stablecoins, and decentralized finance use cases.</p></li><li><p>​<strong>Support Cross-Border Expansion</strong>: Enable startups to expand globally with the support of partners like Ripple and JETRO.</p></li></ul><h2><strong>​Who Are the Partners?</strong></h2><p>​This event is co-created by leading partners who bring unique strengths:</p><ul><li><p>​<strong>Ripple</strong> – Through the <strong>XRPL Japan &amp; Korea Fund</strong>, Ripple is accelerating Web3 adoption in Japan by supporting startups, building cross-border payment solutions, and enabling tokenization use cases.</p></li><li><p>​<strong>JETRO (Japan External Trade Organization)</strong> – A government-backed agency that helps Japanese startups expand overseas and connects international companies to Japan’s ecosystem.</p></li></ul><p>​<strong>Web3 Salon &amp; Asia Web3 Alliance Japan</strong> – A community-driven network supporting founders, VCs, and corporates in building meaningful collaborations across Asia’s Web3 ecosystem.</p><p><strong>Location</strong></p><p><strong>QUINTBRIDGE</strong></p><p>4-chōme-15-82 Higashinodamachi, Miyakojima Ward, Osaka, 534-0024, Japan</p>	2025-09-16	2:30 PM – 5:30 PM (JST)	4‑chome‑15‑82 Higashinodamachi, Miyakojima Ward, Osaka 534‑0024, Japan	/images/2af3df4f-ec9a-4090-9be6-390e3dcdf5cb-5d237cb2.avif	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:23:00.440008+00	\N	[]	[]	https://luma.com/jlnfu5km	Join Waitlist	Official side event of Global Startup Expo 2025 & EDCON Osaka	QUINTBRIDGE	\N	\N	[]	[]
7	XRP TOKYO – VIP After Party	xrp-tokyo-vip-after-party	Following XRP Tokyo and the TEAMZ Summit, a select group of guests gathered for an exclusive VIP After Party. This private reception was designed for meaningful conversations in an intimate and relaxed setting, bringing together distinguished speakers, sponsors, partners, investors and carefully selected XRPL community leaders	<p>XRP TokyoおよびTEAMZ Summit終了後、選ばれたゲストの皆さまをお迎えし、特別なVIPアフターパーティーを開催いたします。</p><p>​本レセプションは、落ち着いたプライベートな空間で有意義な交流を深めていただくことを目的とし、登壇者、スポンサー、パートナー、投資家、そして厳選されたXRPLコミュニティリーダーの皆さまが一堂に会します。</p><p>​日本のWeb3、金融、そして企業分野を代表するリーダーの方々、ならびにXRP TokyoおよびTEAMZの登壇者・VIPゲストとともに、上質なネットワーキングと祝賀のひとときをお過ごしください。</p><p>​<br>&lt;<strong>参加について&gt;</strong></p><p>​<strong>本イベントは承認されたQRコードをお持ちの方のみご参加いただけます。</strong></p><p>​<strong>承認済みのQRコードがない方はご入場いただけません。</strong></p><p>​<strong>&lt;アジェンダ&gt;</strong><br>18:30　受付開始（5F）<br>19:00　オープニング<br>19:05　Datavault AI セッション<br>19:10　乾杯<br>20:45　クロージング<br>21:00　終了</p><p>​<strong>&lt;内容&gt;</strong></p><p>​• 国内外の業界リーダーとのプライベートネットワーキング • ドリンクおよび軽食のご提供 • XRPLコミュニティの祝賀交流 • ステージを超えた長期的な関係構築の機会</p><p>​&lt;重要事項&gt;</p><p>​本イベントは非公開の招待制イベントです。 参加人数には限りがあり、事前承認が必要となります。</p><p>​<br>XRP Tokyoをともに祝えることを楽しみにしております。<br><br><br>[English]</p><p>​Following XRP Tokyo and the TEAMZ Summit, a select group of guests will gather for an exclusive VIP After Party.<br>This private reception is designed for meaningful conversations in an intimate and relaxed setting, bringing together distinguished speakers, sponsors, partners, investors, and carefully selected XRPL community leaders.<br>Join leading figures from Japan’s Web3, finance, and corporate sectors, along with XRP Tokyo and TEAMZ speakers and VIP guests, for an evening of elevated networking and celebration.<br><strong>&lt;Attendance&gt;</strong><br><strong>Only guests with an approved QR code will be allowed to attend this event. Entry will not be permitted without a valid approved QR code.</strong></p><p>​<strong>&lt;Timeline&gt;</strong><br>18:30 – Registration opens (5F)<br>19:00 – Opening(6F)<br>19:05 – Datavault AI Session<br>19:10 – Toast<br>20:45 – Closing<br>21:00 – End</p><p>​<br><br><strong>&lt;What to Expect&gt;</strong><br>• Private networking with global and Japanese industry leaders<br>• Drinks and light refreshments<br>• Celebratory XRPL community gathering<br>• The opportunity to build lasting relationships beyond the stage<br><br><br>&lt;<strong>Important Note&gt;</strong><br>This is a private event. Attendance is limited and requires prior approval or VIP access.<br><br>We look forward to celebrating XRP Tokyo together.</p>	2026-04-07	6:30 PM - 8:30 PM	\N	/images/408d4435-a44a-4207-af8a-d8454680e7dd-96a975b6.avif	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 03:56:54.35147+00	\N	[]	[]	https://luma.com/da2ucul1	Join Waitlist	Exclusive reception following XRP Tokyo & TEAMZ Summit	Minato City, Japan	\N	\N	[]	[]
10	Web3 Salon – AI x On Chain Gaming : BGA x Tokyo Game Show	web3-salon-ai-x-on-chain-gaming-bga-x-tokyo-game-show	Join us at Web3 Salon’s Tokyo Game Show side event, where gaming meets the decentralized future! This exclusive gathering brings together blockchain and AI gaming startups, investors, developers and content creators to connect, collaborate and explore new opportunities in Web3 gaming. Hosted in collaboration with Asia Web3 Alliance Japan, the Blockchain Game Alliance, JETRO and AI on Web3, the event serves as a launchpad for startups and studios pushing the boundaries of AI, Web3 and interactive entertainment	<p>Join us at the <strong>Web3 Salon – TGS Side Event</strong>, where gaming meets the decentralized future! As Tokyo Game Show brings the gaming world together, we’re creating an exclusive space for <strong>blockchain and AI gaming startups, investors, developers, and content creators</strong> to connect, collaborate, and explore new opportunities in Web3 gaming.</p><p>​🌟 <strong>Hosted in collaboration with Asia Web3 Alliance Japan, Blockchain Game Alliance, JETRO </strong>and <strong>AI on Web3</strong>, this event is a launchpad for startups and studios pushing boundaries across AI, Web3, and interactive entertainment.</p><p>​✅ <strong>Startup Demos:</strong> See how blockchain and AI are transforming gameplay, ownership, and monetization<br>✅ <strong>Investor Meetups:</strong> Get face time with VCs actively investing in Web3 x AI gaming<br>✅ <strong>Global Perspectives:</strong> Learn from international leaders breaking into Japan and Asia<br>✅ <strong>JETRO, Blockchain Game Alliance &amp; Partner Support:</strong> Get hands-on guidance and support to grow your gaming business with the help of leading industry organizations and accelerator networks</p><p>​Whether you’re a<strong> game studio using AI or/and blockchain</strong>, a <strong>traditional gaming company entering blockchain</strong>, or an <strong>investor scouting the next big thing</strong>, this side event is your gateway to the future of gaming.</p><p>​🎤 <em>Limited speaking slots and demo opportunities available — apply early!</em></p><p>​<em>To pitch </em><a target="_blank" rel="nofollow noopener" href="https://docs.google.com/forms/d/e/1FAIpQLSfu6CQLZJZf8RrE-4JrdjkXE-tjfjARm9jSH4NAtMHl81YjPg/viewform?usp=sharing&amp;ouid=106432594619727695537&amp;utm_source=luma"><em>apply here</em></a><em>.</em><br><br>Let’s build the future of gaming — together.<br><strong>Powered by Web3 Salon | Supported by Asia Web3 Alliance Japan, JETRO &amp; Blockchain Game Alliance</strong></p><p><strong>Location</strong></p><p><strong>Ark Mori Bldg.</strong></p><p>Ark Mori Building, 1-chōme-12-32 Akasaka, Minato City, Tokyo 107-6090, Japan</p><p>Please come up to 7th floor.<br>( from the elevator placed next to Starbucks)</p>	2025-09-24	17:30 – 21:00 (JST)	Ark Mori Building, 1‑chōme‑12‑32 Akasaka, Minato City, Tokyo 107‑6090, Japan	/images/7c39f9b5-7a25-45f8-a6c7-3c9cf99adce9-ff70515d.avif	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:14:46.270116+00	\N	[]	[]	https://luma.com/dmir765w	Request to Join	Official side event at Tokyo Game Show 2025	Ark Mori Building, 7th Floor	https://docs.google.com/forms/d/e/	Apply to Pitch	[]	[]
14	Web3 salon VC connect -Scaling Web3 Innovation in the Middle East -	web3-salon-vc-connect-scaling-web3-innovation-in-the-middle-east-	Join us for an exclusive in‑person workshop to explore Web3 expansion opportunities in the Middle East market. Supported by JETRO, this Web3 Salon initiative brings together leading investors and successful entrepreneurs to share insights on entering the Middle East market. The session serves as a comprehensive introduction to JETRO’s J‑StarX Middle East Web3 Program—designed to accelerate Japanese startups’ expansion through collaborations with WebX, GITEX and Elixir Capital. Participants will learn how to navigate the region’s Web3 ecosystem, understand regulatory landscapes and leverage Abu Dhabi’s Hub71 accelerator network	<p>中東市場におけるWeb3事業の展開機会を探る特別ワークショップを開催します。JETROが支援する「Web3 Salon」の一環として、中東市場参入戦略に関する知見を持つ有力投資家および成功起業家が集結します。</p><p>​<strong>登壇者:</strong></p><ul><li><p>​Elixir Capital 代表（英国拠点Web3 VC／Hub71公式パートナー）</p></li><li><p>​Outlier Ventures 投資チーム（調整中）</p></li><li><p>​Bitgrit 向縄 嘉律哉氏（中東で活動する日本人Web3起業家）</p></li></ul><p>​本ワークショップでは、日本のスタートアップの中東・北アフリカ（MENA）地域進出を加速させる<a target="_blank" rel="nofollow noopener" href="https://www.jetro.go.jp/services/j-starx/c333.html?utm_source=luma">「JETRO J-StarX 中東Web3プログラム」</a>を包括的にご紹介します。WebX、GITEX、エリクサー・キャピタルとの連携により、参加者は以下の実践的知見が得られます：</p><ul><li><p>​中東Web3エコシステムの活用方法</p></li><li><p>​規制環境の理解</p></li><li><p>​アブダビのHub71アクセラレーターネットワークの活用法</p></li></ul><p>​<strong>プログラム詳細:</strong></p><p>​<a target="_blank" rel="noopener noreferrer" href="https://www.jetro.go.jp/ext_images/services/jstarx/pdf/2025_c333v2.pdf"><strong>https://www.jetro.go.jp/ext_images/services/jstarx/pdf/2025_c333v2.pdf</strong></a></p><p>​<strong>応募締切:</strong> 2025年7月31日</p><p>​<strong>対象者:</strong> 中東市場への展開を目指す日本発Web3スタートアップ・起業家・投資家</p><p>​<strong>アジェンダ</strong></p><p>​<strong>18:00〜18:30</strong>｜受付 &amp; ネットワーキング</p><p>​<strong>18:30〜18:45</strong>｜開会の挨拶（オフライン）</p><ul><li><p>​JETRO代表 / 加賀 裕介氏 より開会のご挨拶</p></li><li><p>​Hub71 クロスボーダーマネージャー Mona Alhashmi 氏によるアブダビにおけるWeb3の概要紹介</p></li><li><p>​Web3 Salon代表 Hinza 氏によるWeb3 Salonイニシアチブの紹介</p></li></ul><p>​<strong>18:45〜19:10</strong>｜基調講演（オンライン）<br><strong>「MENA地域におけるWeb3投資の現状」</strong><br>登壇者：Elixir Capital（英国拠点のWeb3ベンチャーキャピタル）</p><ul><li><p>​<strong>Maddy</strong>（プログラムマネージャー）<br>　Web3起業家・オペレーター。Zephyr元COO、Elektra Ventures共同創業者。Elixirではオペレーション、コミュニティ、レポート業務を主導。</p></li><li><p>​<strong>Rachel</strong>（プログラムディレクター）<br>　Outlier Ventures元Platform責任者。20以上のグローバルアクセラレータを管理。Elixirではプログラム設計、創業者支援、パフォーマンス評価を担当。</p></li></ul><p>​<strong>19:10〜19:25</strong>｜ファイヤーサイドチャット #1（オンライン）<br><strong>「Outlier Ventures（世界有数のWeb3アクセラレーター）とElixir Capitalの対談」</strong></p><ul><li><p>​<strong>Bandar Altunisi 氏</strong>（Outlier Ventures取締役）<br>　元BinanceのMENA地域インスティテューショナルリレーションズ責任者。NY弁護士資格を持ち、Web3の法務・規制・事業開発に精通。<a target="_blank" rel="noopener noreferrer" href="http://easeflow.io">easeflow.io</a>共同創業者であり、アラブ圏のWeb3エコシステムの拡大に尽力。</p></li></ul><p>​<strong>19:25〜19:45</strong>｜ファイヤーサイドチャット #2（ハイブリッド）<br><strong>「Hub71とBitgrit（日本発スタートアップ）の対談」</strong></p><ul><li><p>​<strong>Mona Alhashmi 氏</strong>（Hub71 クロスボーダーマネージャー）</p></li><li><p>​<strong>崎名 和也 氏</strong>（Bitgrit共同創業者）<br>　日本発のスタートアップBitgritは中東に拠点を展開。</p></li></ul><p>​<strong>19:50〜21:00</strong>｜ネットワーキング</p><hr><p>​Join us for an exclusive in-person workshop exploring Web3 expansion opportunities in the Middle East market. This Web3 Salon initiative, supported by JETRO, brings together leading investors and successful entrepreneurs to share insights on Middle East market entry strategies.</p><p>​<strong>Featured Speakers:</strong></p><ul><li><p>​Elixir Capital (UK-based Web3 VC and official Hub71 partner)</p></li><li><p>​Outlier Ventures (TBD)</p></li><li><p>​Kazuya Saginawa from Bitgrit (Japanese Web3 entrepreneur active in the Middle East)</p></li></ul><p>​This workshop serves as a comprehensive introduction to JETRO's J-StarX Middle East Web3 Program, designed to accelerate Japanese startups' expansion into the MENA region through collaborations with WebX, GITEX and Elixir Capital. Participants will gain practical insights into navigating the Middle East Web3 ecosystem, understanding regulatory landscapes, and leveraging Abu Dhabi's Hub71 accelerator network.</p><p>​<strong>Program Details:</strong></p><p>​<a target="_blank" rel="noopener noreferrer" href="https://www.jetro.go.jp/ext_images/services/jstarx/pdf/2025_c333_en-v2.pdf">https://www.jetro.go.jp/ext_images/services/jstarx/pdf/2025_c333_en-v2.pdf</a></p><p>​<strong>Application Deadline:</strong> July 31, 2025</p><p>​<strong>Target Audience:</strong> Japanese Web3 startups, entrepreneurs, and investors seeking Middle East market expansion<br><br><strong>Agenda</strong><br><strong>18:00-18:30 : Registration &amp; Networking</strong></p><p>​<strong>18:30-18:45 : Welcome Address (Offline)</strong></p><ul><li><p>​Opening remarks from JETRO representative <em>/ </em>Yusuke Kaga</p></li><li><p>​Overview on Web3 in Abu Dhabi by Hub71 / Mona Alhashmi, Cross-boarder Manager at Hub71</p></li><li><p>​Overview of the Web3 Salon initiative / Hinza, Web3 Salon</p></li></ul><p>​<strong>18:45-19:10 : Keynote - Web3 Investment Landscape in the MENA Region - Speakers: Elixir Capital (UK-based Web3 VC)&nbsp;(Online)</strong></p><ul><li><p>​<strong>Maddy – Program Manager at Elixir Capital</strong><br>* Web3 entrepreneur and operator focused on scaling ventures and building community.<br>* Former COO of Zephyr and co-founder of Elektra Ventures, a Web3 growth studio.<br>* Leads operations, community, and reporting for Elixir.</p></li><li><p>​<strong>Rachel – Program Director at Elixir Capital</strong><br>* Former Head of Platform at Outlier Ventures, managing 20+ global accelerators.<br>* Drives value-add support across the Elixir portfolio, from platform to partnerships.<br>* Oversees program design, founder experience, and performance tracking for Elixir</p></li></ul><p>​<strong>19:10-19:25 : Fireside chat #1 | the Outlier Venture (One of the world’s leading Web3 accelerators) and Elixir capital (Online)</strong></p><ul><li><p>​<strong>Bandar Altunisi – Board Member, Outlier Ventures*</strong><br>* Former Binance Head of Institutional Relationships for MENA, leading strategic engagement across Saudi and Dubai.<br>* Practicing NY-qualified lawyer with deep experience in Web3 legal structuring, regulatory frameworks, and BD.<br>* Co-founder of <a target="_blank" rel="noopener noreferrer" href="http://easeflow.io">easeflow.io</a> and advocate for growing the Arab Web3 ecosystem, combining traditional finance with crypto innovation.<br>* Board member at Outlier Ventures, supporting MENA expansion.</p></li></ul><p>​<strong>19:25-19:45 : Fireside chat #2 | Hub71 and Kazuya Saginawa, Co-founder, Bitgrit (Hybrid)</strong></p><ul><li><p>​Mona Alhashmi, Cross-boarder Manager at Hub71</p></li><li><p>​Kazuya Saginawa, Co-founder, Bitgrit - Japanese Startups has an office in the Middle East.</p></li></ul><p>​<strong>19:50 – 21:00 : Networking</strong></p><p><strong>Location</strong></p><p><strong>Ark Mori Bldg.</strong></p><p>Ark Mori Building, 1-chōme-12-32 Akasaka, Minato City, Tokyo 107-6090, Japan</p>	2025-07-29	18:00 – 21:00 (JST)	Ark Mori Building, 1‑chōme‑12‑32 Akasaka, Minato City, Tokyo 107‑6090, Japan	/images/810ebab5-efa2-4448-abb9-4e0c8beb70e7-9ae5f41a.avif	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:37:59.710767+00	\N	[]	[]	https://luma.com/uwvhcm5j	Request to Join	Exclusive in‑person workshop exploring Middle East Web3 opportunities	Ark Mori Building	\N	\N	[]	[]
8	日本金融インフライノベーションプログラム(JFIIP) - AMA説明会	jfiip-ama	Asia Web3 Alliance Japan (AWAJ) has launched the Japan Financial Infrastructure Innovation Program (JFIIP), which helps Web3, AI and fintech founders transform ideas into investable financial infrastructure businesses. This AMA info session explains why this programme matters and how it addresses regulatory, technical and funding challenges	<p><strong>日本金融インフライノベーションプログラム(JFIIP) - AMA説明会</strong></p><p>​<strong>ただのAMAではありません。ファウンダーの皆様はぜひご注目ください。</strong></p><p>​この度Asia Web3 Alliance Japan(AWAJ)は、<strong>Web3・AI・フィンテック領域のファウンダー</strong>がただのアイデアを<strong>「実際に投資可能な金融インフラビジネス」</strong>へ変貌させるプログラムを開始いたします。</p><p>​今回のAMAでは、<strong>なぜ今、本プログラムが重要なのか</strong>をご説明します。</p><p>​現在日本ではこのような課題があります：<br><br>・アイデアやPoC(概念実証)の段階で立ち止まってしまうスタートアップが多い<br>・規制、金融、そしてエンタープライズが直面している現実を過小評価しているファウンダーが多い<br><br>このような課題を乗り越えるために本プログラムを始めました。特に金融の領域で「実際に機能するビジネス」を創りたい願う起業家の皆様は、ぜひ今回のAMAをご視聴ください。<br></p><p>​<strong>🗓 開催概要</strong></p><p>​<strong>⏰ 1月14日(水) 21:00-22:00 ※日本時間</strong><br>📍 <strong>X (旧Twitter)スペース</strong><br>X Space :<br><a target="_blank" rel="noopener noreferrer" href="https://x.com/i/spaces/1yNxabWlzbjKj?s=20">https://x.com/i/spaces/1yNxabWlzbjKj?s=20</a></p><p>​<strong>🎙 登壇者 ※敬省略</strong></p><ul><li><p>​<a target="_blank" rel="nofollow noopener" href="https://x.com/Mai_XRPLJapan?utm_source=luma"><strong>古川 舞</strong></a><br><strong>XRPL Japan, </strong>Co-founder &amp; Director</p></li><li><p>​<a target="_blank" rel="nofollow noopener" href="https://x.com/0xpokotaro?utm_source=luma"><strong>増田健太郎</strong></a><br><strong>XRPL Japan, </strong>Director &amp; BizDev</p></li><li><p>​<a target="_blank" rel="nofollow noopener" href="https://x.com/nabe3_m?utm_source=luma"><strong>Nabe3</strong></a><br><strong>XRPL Japan, </strong>XRPL Ecosystem Developer &amp; CTO</p></li><li><p>​<strong>モデレーター：大谷かなこ</strong><br><strong>0x Consulting Group / AWAJメンバーシップ担当&nbsp;</strong></p></li></ul><p>​XRPLエコシステムの最前線から、起業家にとってなぜ今が金融インフラを創り始めるベストタイミングなのか？など<strong>リアルなインサイト</strong>をお届けします。</p><p>​<strong>🎯 セッション内容 (予定)</strong></p><ul><li><p>​<strong>Web3、フィンテックのビジネスアイデアの大半が失敗する</strong>理由</p></li><li><p>​なぜ<strong>「金融インフラ」</strong>が次に来る大きなビジネスチャンスなのか？なぜ<strong>XRPL</strong>が金融領域において重要なのか？</p></li><li><p>​<strong>XRPLによって、どのように実社会で使用される金融ユースケースができるのか？</strong>(決済、RWA、清算、企業の活用など)</p></li><li><p>​本プログラムにて、XRPLを基盤として<strong>技術・規制・資金の課題をどのように解決する</strong>のか？</p></li><li><p>​<strong>「アイデア → プロダクト開発 → パートナーシップ締結 → 投資獲得」</strong>へと進むステップ</p></li><li><p>​本プログラムへの応募をおすすめしたい人は？</p></li></ul><p>​🗓 JFIIP応募申し込み期日：2026年1月18日<br><br><strong>応募フォーム：</strong><br><a target="_blank" rel="noopener noreferrer" href="https://forms.cloud.microsoft/r/sApAbeFPpP">https://forms.cloud.microsoft/r/sApAbeFPpP</a></p><p>​<strong>社会を変える、実装可能な金融インフラを一緒に実現しませんか？</strong><br><strong>ファウンダーの皆様はぜひご視聴ください。</strong></p>	2026-01-14	5:30 PM - 6:30 PM GMT+5:30	\N	/images/6b72d7c7-8949-42f3-b511-28c46250763b-701606e3.avif	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 04:08:25.494017+00	\N	[]	[]	https://luma.com/muc7eoxq	Register	Not just an AMA session – founders, please pay close attention	Online	https://forms.cloud.microsoft/r/sApAbeFPpP	Apply to JFIIP	[]	[]
9	(Invite Only) Web3 Salon年末交流会2025：日本のデジタル未来を共に創る	invite-only-web3-salon2025	(Invite Only) Web3 Salon年末交流会2025：日本のデジタル未来を共に創る	<p>​<a target="_blank" rel="nofollow noopener" href="https://web3salon.or.jp/?utm_source=luma">Web3 Salon</a>年末交流会2025は、今年一年にわたるコミュニティ活動の集大成であり、イノベーション、コラボレーション、そして日本のWeb3エコシステムの成長を共に祝う特別なイベントです。<br>本イベントは <a target="_blank" rel="nofollow noopener" href="https://www.jetro.go.jp/?utm_source=luma"><strong>JETRO（日本貿易振興機構</strong></a><strong>）</strong> および <a target="_blank" rel="nofollow noopener" href="https://asiaweb3alliance.jp/?utm_source=luma"><strong>Asia Web3 Alliance Japan（AWAJ</strong></a><strong>）</strong> の共催により開催され、起業家、投資家、企業パートナー、政策リーダーなど、主要なステークホルダーが一堂に集まります。<br>2025年の成果を振り返りつつ、2026年以降に向けた新たな展望と可能性について議論を深める場となります。</p><p>​本限定セッションでは、コミュニティの主な出来事を振り返り、パートナーの実績を紹介するほか、Web3、ブロックチェーン、AI主導のイノベーション分野におけるグローバルハブとして日本を位置付けるべく、今後の協業計画を発表いたします。</p><p>​<strong>イベントアジェンダ</strong></p><p>​<strong>18:00 – 18:30｜受付・ウェルカム</strong></p><ul><li><p>​参加者受付</p></li><li><p>​定刻でのご来場にご協力ください</p></li></ul><p>​<strong>18:30 – 18:40｜開会挨拶・歓迎スピーチ</strong></p><ul><li><p>​JETROによるご挨拶（10分）</p></li></ul><p>​<strong>18:40 – 18:50｜Web3 Salon プログラム概要</strong></p><ul><li><p>​Web3 Salon イニシアティブの紹介</p></li><li><p>​Asia Web3 Alliance Japan（AWAJ）による説明（10分）</p></li></ul><p>​<strong>18:50 – 19:30｜スタートアップパネル：グローバル展開の実践経験</strong></p><ul><li><p>​各スタートアップ企業による紹介および海外市場展開に関するディスカッション<br>- <a target="_blank" rel="nofollow noopener" href="https://golfin.io/?utm_source=luma">Golfin</a><br>- <a target="_blank" rel="nofollow noopener" href="https://meclabo.com/?utm_source=luma">MEC Labo</a><br>- <a target="_blank" rel="nofollow noopener" href="https://www.andlaw.co.jp/?utm_source=luma">ANDLAW</a><br>- Laplace</p></li></ul><p>​<strong>19:30 – 19:35｜IOLITE - bitlending プレゼンテーション&nbsp;</strong>（5分）</p><p>​<strong>19:35 – 19:55｜新プログラム発表・パネルディスカッション</strong></p><ul><li><p>​今後のプログラム発表</p></li><li><p>​エコシステムパートナーとのパネルディスカッション</p></li></ul><p>​<strong>19:55 – 20:30｜ネットワーキングセッション</strong></p><ul><li><p>​自由交流</p></li><li><p>​軽食・ドリンク提供</p></li><li><p>​創業者、投資家、パートナーとの招待制ネットワーキング</p></li></ul><p><strong>​期待できる内容</strong></p><ul><li><p>​開会の辞：JETROおよびAWAJ代表者</p></li><li><p>​パネルディスカッション：<br>　<strong>「日本のデジタル未来像を築く — Web3協業の次なるフェーズへ」</strong></p></li><li><p>​コミュニティハイライト：成功事例および2025年のパートナーシップ</p></li><li><p>​2026年の展望：新たな取り組み、国際的パートナーシップ、イノベーション推進プログラム</p></li><li><p>​ネットワーキングセッション：起業家、投資家、Web3エコシステムのパートナーと交流</p></li></ul><p><strong>​参加する理由</strong></p><ul><li><p>​2025年のWeb3 Salonコミュニティの成果を祝う</p></li><li><p>​2026年を見据えた国境を超える協業と新たなWeb3プログラムの展開</p></li><li><p>​日本の官民エコシステムリーダーとの交流の機会</p></li><li><p>​国際的なデジタル経済における日本の役割と未来像を探る</p></li></ul><p><strong>​参加ポリシー</strong></p><p>​本イベントは、JETRO東京本部の会場スペースに限りがあるため、<strong>ご招待制</strong>となっております。<br>ご参加が確定された方には、後日、詳細および入場方法を記載した正式な確認メールをお送りいたします。</p><p>​Web3 Salonメンバー、またはJETROパートナー団体で参加をご希望の方は、下記の運営事務局までご連絡ください。</p><p><strong>​Web3 Salon について</strong></p><p>​Web3 Salonは、<strong>Asia Web3 Alliance Japan（AWAJ）</strong> が推進し、<strong>JETRO</strong> の支援のもと運営されるコラボレーション型コミュニティです。<br>日本および海外のWeb3起業家、投資家、イノベーター同士をつなぐことを目的とし、コラボレーション提案、スタートアップ支援、国境を越えた協業のためのプラットフォームを提供しています。<br>これにより、日本がグローバルWeb3エコシステムにおいて重要な役割を果たすことを加速させることを目指しています。</p><p><strong>​開催概要</strong></p><ul><li><p>​<strong>開催日：</strong> 2025年12月19日（金）</p></li><li><p>​<strong>時間：</strong> 18:00〜20:30（日本時間）</p></li><li><p>​<strong>会場：</strong> JETRO東京本部</p></li><li><p>​<strong>共催：</strong> JETRO &amp; Asia Web3 Alliance Japan (AWAJ)</p></li><li><p>​<strong>言語：</strong> 日本語・英語</p></li><li><p>​<strong>参加：</strong> ご招待者のみ（席数限定）</p></li></ul><p><strong>​お問い合わせ先</strong></p><ul><li><p>​<strong>Asia Web3 Alliance Japan（AWAJ）</strong></p></li><li><p>​Email: <a target="_blank" rel="noopener noreferrer" href="mailto:bm@asiaweb3alliance.jp">bm@asiaweb3alliance.jp</a>&nbsp;</p></li><li><p>​Website:<a target="_blank" rel="noopener noreferrer" href="http://asiaweb3alliance.jp">asiaweb3alliance.jp</a></p></li></ul><h2><strong>​<em>—English</em></strong></h2><p><strong>​About the Event</strong></p><p>​The Web3 Salon Year-End Gathering 2025 marks the grand conclusion of this year’s community activities — a celebration of innovation, collaboration, and the growing strength of Japan’s Web3 ecosystem.<br><br>Co-organized by <strong>JETRO</strong> and <strong>Asia Web3 Alliance Japan (AWAJ)</strong>, this event brings together founders, investors, corporate partners, and policy leaders to reflect on the successes of 2025 and explore new opportunities for 2026 and beyond.<br><br>This session will highlight major community milestones, showcase partner achievements, and announce upcoming collaborative initiatives to position Japan as a global hub for Web3, blockchain, and AI-driven innovation.<br><br>Event<strong> Agenda</strong></p><p>​18:00<strong> – 18:30 | Reception and welcome</strong></p><ul><li><p>​Participant reception</p></li><li><p>​Please cooperate by arriving on time</p></li></ul><p>​18:30<strong> – 18:40 | Opening remarks and welcome speeches</strong></p><ul><li><p>​Greetings from JETRO</p></li></ul><p>​18:40<strong> – 18:50 | Web3 Salon Program Overview</strong></p><ul><li><p>​Introducing the Web3</p></li><li><p>​Asia Web3 Alliance Japan (AWAJ) presentation (10 minutes)</p></li></ul><p>​18:50<strong> – 19:30 | Startup Panel: Practical Experiences in Global Expansion</strong></p><ul><li><p>​Introductions by startup<br>- <a target="_blank" rel="nofollow noopener" href="https://golfin.io/?utm_source=luma">Golfin</a><br>- <a target="_blank" rel="nofollow noopener" href="https://meclabo.com/?utm_source=luma">MEC Labo</a><br>- <a target="_blank" rel="nofollow noopener" href="https://www.andlaw.co.jp/?utm_source=luma">ANDLAW</a><br>- Laplace</p></li></ul><p>​19:30<strong> – 19:35 | IOLITE - bitlending Presentation&nbsp;</strong> (5 minutes)</p><p>​19:35<strong> – 19:55 | New program announcement and panel discussion</strong></p><ul><li><p>​Upcoming program announcements</p></li><li><p>​Panel discussion with ecosystem</p></li></ul><p>​19:55<strong> – 20:30 | Networking session</strong></p><ul><li><p>​Free exchange</p></li><li><p>​Light snacks and drinks provided</p></li><li><p>​Invitation-only networking with founders</p></li></ul><p><strong>​What to Expect</strong></p><ul><li><p>​Opening Remarks by representatives of JETRO &amp; AWAJ</p></li><li><p>​Panel Discussion:<br><strong>“Shaping Japan’s Digital Future — The Next Phase of Web3 Collaboration”</strong></p></li><li><p>​Community Highlights: Success stories and partnerships from 2025</p></li><li><p>​2026 Outlook: New initiatives, international partnerships, and innovation programs</p></li><li><p>​Networking Session with founders, investors, and Web3 ecosystem partners</p></li></ul><p><strong>​Why Attend</strong></p><ul><li><p>​Celebrate the accomplishments of the Web3 Salon community in 2025</p></li><li><p>​Discover new cross-border collaborations and Web3 initiatives for 2026</p></li><li><p>​Connect with leaders across Japan’s public and private sectors</p></li><li><p>​Gain insights into Japan’s evolving role in the global digital economy</p></li></ul><p><strong>​Attendance Policy</strong></p><p>​Due to limited capacity at the JETRO Tokyo Office, this event is <strong>by invitation only</strong>.<br>Confirmed attendees will receive an official confirmation email with event details and access instructions.<br>Members of Web3 Salon or JETRO partner organizations who wish to attend may contact the organizing team below.</p><h2><strong>​About AWAJ</strong></h2><p>​The <strong>Asia Web3 Alliance Japan (AWAJ)</strong> is dedicated to advancing Web3 innovation and strengthening international connections. By working closely with ecosystems in Japan, the UAE, and Singapore, AWAJ supports startups, corporates, investors, and policymakers through programs, events, and collaborative opportunities that expand Japan’s role in the global Web3 landscape.,</p><h2><strong>​About JETRO</strong></h2><p>​<strong>JETRO (Japan External Trade Organization)</strong> is a government-affiliated agency that promotes global expansion for Japanese companies and attracts foreign innovation into Japan. JETRO plays a central role in supporting cross-border partnerships and enabling collaboration within Japan’s growing startup and Web3 ecosystems.</p><h2><strong>​About Web3 Salon</strong></h2><p>​Web3 Salon is a collaborative community powered by <strong>Asia Web3 Alliance Japan (AWAJ)</strong> and supported by <strong>JETRO</strong>.<br>It connects Japanese and international Web3 founders, investors, and innovators, providing a platform for collaboration, startup support, and cross-border partnerships — accelerating Japan’s position within the global Web3 ecosystem.</p><p><strong>​Event Details</strong></p><ul><li><p>​<strong>Date:</strong> Friday, December 19, 2025</p></li><li><p>​<strong>Time:</strong> 18:00–20:30 JST</p></li><li><p>​<strong>Venue:</strong> JETRO Tokyo Office</p></li><li><p>​<strong>Co-organized by:</strong> JETRO &amp; Asia Web3 Alliance Japan (AWAJ)</p></li><li><p>​<strong>Language:</strong> Japanese &amp; English</p></li><li><p>​<strong>Attendance:</strong> Invitation Only (Limited Seats)</p></li></ul><p><strong>​Contact</strong></p><ul><li><p>​<strong>Website:</strong> <a target="_blank" rel="noopener noreferrer" href="http://asiaweb3alliance.jp">asiaweb3alliance.jp</a></p></li><li><p>​<strong>Email:</strong><a target="_blank" rel="noopener noreferrer" href="mailto:bm@asiaweb3alliance.jp">bm@asiaweb3alliance.jp</a></p></li></ul><p><strong>Location</strong></p><p><strong>〒107-6006 東京都港区赤坂1丁目12-32 アーク森ビル（7階）</strong></p>	2025-12-19	6:00 PM - 8:30 PM GMT+9	〒107‑6006 Tokyo, Minato‑ku, Akasaka 1‑12‑32, Ark Mori Building 7F	/images/9e0ca904-947c-49a5-9a5f-4b240c71b10f-125639b4.avif	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:07:28.818369+00	\N	[]	[]	https://luma.com/lbwxtl7m	Request to Join	Invite‑Only event co‑hosted by Web3 Salon and JETRO	JETRO Tokyo Headquarters (Ark Mori Building, 7th Floor)	\N	\N	[]	[]
6	VC Connect @ WebX 2026	vc-connect-webx-2026	​The program is designed to facilitate meaningful discussions on fundraising, venture investment, startup growth, market expansion, emerging technologies, and cross-border collaboration. Through curated VC panels, investor discussions, and networking opportunities, VC Connect serves as a bridge connecting founders, investors, corporations, and innovation leaders.	<p>VC Connect is a dedicated venture capital and startup networking stage at WebX 2026, bringing together venture capital firms, angel investors, corporate venture capital teams, startup founders, accelerators, and ecosystem leaders from Japan and around the world.</p><p>​The program is designed to facilitate meaningful discussions on fundraising, venture investment, startup growth, market expansion, emerging technologies, and cross-border collaboration. Through curated VC panels, investor discussions, and networking opportunities, VC Connect serves as a bridge connecting founders, investors, corporations, and innovation leaders.</p><p>​VC Connect is organized under <strong>Web3 Salon</strong>, an ecosystem-building initiative launched by JETRO (Japan External Trade Organization) in collaboration with public and private sector partners. The initiative is supported by various government agencies, industry organizations, corporations, investors, and ecosystem stakeholders to strengthen Japan's startup and innovation ecosystem and promote international collaboration.</p><p>​Event Highlights</p><ul><li><p>​Venture Capital Leadership Panels</p></li><li><p>​Investor &amp; Founder Discussions</p></li><li><p>​Startup Fundraising Insights</p></li><li><p>​Cross-Border Investment Opportunities</p></li><li><p>​Corporate Venture Capital Perspectives</p></li><li><p>​AI, Web3, Fintech &amp; Emerging Technology Trends</p></li><li><p>​Investor &amp; Founder Networking</p></li></ul><p>​Organized By</p><ul><li><p>​Web3 Salon</p></li><li><p>​Asia Web3 Alliance Japan (AWAJ)</p></li></ul><p>​Venue</p><p>​WebX 2026, Tokyo, Japan</p>	2026-07-13	12:00 PM – 5:00 PM (JST)	\N	/images/VC-connect-Webx--b16acb8e.png	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 02:27:03.357938+00	/images/VC-connect-Webx--2bad6a8b.png	[]	[]	https://luma.com/4f4zkaj2	Request to Join	Powered by Web3 Salon & Asia Web3 Alliance Japan (AWAJ)	The Prince Park Tower Tokyo	\N	\N	[]	[]
17	PREMIUM Web3 Salon : VC Connect - Bridging Global Investors By JETRO & TAISU VENTURES	premium-web3-salon-vc-connect-bridging-global-investors-by-jetro-taisu-ventures	Join us for an exclusive afternoon of insight, connection and opportunity at the Premium Web3 Salon VC Connect, a Web3 Investment & Innovation Summit hosted and supported by JETRO and Taisu Ventures. Set against the backdrop of Tokyo’s Ark Mori Building, the event features a high‑calibre investor panel, keynote speeches and a showcase of cutting‑edge Web3 startups. Whether you seek market intelligence, promising investment opportunities or strategic partnerships, this summit delivers candid discussions, exclusive insights and unmatched networking with top VCs, institutional investors and emerging projects	<p>Join us for an exclusive afternoon of insight, connection, and opportunity at the <a target="_blank" rel="nofollow noopener" href="https://web3salon.or.jp/?utm_source=luma"><strong>PREMIUM Web3 Salon : VC Connect</strong></a> , a Web3 Investment &amp; Innovation Summit hosted and supported by <strong>JETRO x TAISU VENTURES</strong>. This premier gathering will bring together leading investors, visionary founders, and industry pioneers to explore the latest trends shaping the Web3 landscape.</p><p>​Set against the backdrop of Tokyo’s Ark Mori Building, the event will feature a dynamic agenda—including a high-caliber investor panel, keynote speeches, and a showcase of cutting-edge Web3 startups. Whether you’re looking to gain market intelligence, identify promising investment opportunities, or forge strategic partnerships, this is a must-attend event for anyone shaping the future of decentralized technology.</p><p>​<strong>Event Details</strong></p><p>​📅 <strong>Date:</strong> April 15, 2025<br>⏰ <strong>Time:</strong> 1:00 – 5:00 PM JST (Registration opens at 12:30 PM)<br>📍 <strong>Venue:</strong> Ark Mori Building, 7F, 12-32 Akasaka 1-chome, Minato-ku, Tokyo 107-6006<br>🎤 <strong>Format:</strong> Investor panel, keynote speeches, startup pitches, networking<br>🗣️ <strong>Languages:</strong> The event will be conducted in both <strong>Japanese and English</strong>, with translation assistance available.</p><p>​🚨 <strong>Registration is required to attend. Walk-ins will not be permitted.</strong> Please ensure you sign up in advance to secure your access.</p><p>​<strong>Agenda</strong></p><p>​<strong>12:30 – 13:00 |</strong> Registration<br><strong>13:00 – 13:30 |</strong> <strong>Opening Speeches - JETRO, Shibuya Startup Support, Taisu Ventures</strong><br><strong>13:30 – 14:15 |</strong> <strong>Investor Panel</strong> – Featuring leading VCs and institutional investors<br><strong>14:15 – 14:35 |</strong> <strong>Taisu's Ecosystem Announcement</strong> – Movement Labs<br><strong>14:35 – 16:00 |</strong> <strong>Web3 Startup Pitch Session</strong> – Spotlight on emerging projects<br><strong>16:00 – 17:00 |</strong> <strong>Networking</strong> – Connect with investors, founders, and ecosystem players</p><p>​<strong>Investors Panel</strong></p><p>​Taisu Ventures, SBI, EMURGO Group, Ryobi, Hyperithm, HIRAC Fund</p><p>​<strong>Web3 Startup Attendees</strong></p><p>​Coinstreet, Delabs, Flickplay, Helix, Movement Labs, Ongaeshi, OpenEden, Seaseed, Secured Finance, Sonex, Xociety, Yoake, Zoth.</p><p>​Expect candid discussions, exclusive insights, and unparalleled networking with some of the brightest minds in Web3. <strong>Secure your spot today—registration is mandatory!</strong></p><p>​========================</p><p>​PREMIUM WEB3 Salon VC Connect by JETRO x TAISU VENTURES</p><p>​- Teamz 公式サイドイベント -</p><p>​JETROとTAISU VENTURESが共同開催するこのプレミアムなイベントでは、業界をリードする投資家や革新的な創業者、そして最前線のパイオニアが一堂に会し、Web3の最新トレンドを探求します。</p><p>​📅 日程: 2025年4月15日（火）</p><p>​⏰ 時間: 13:00 – 17:00（受付開始 12:30）</p><p>​📍 会場: 〒107-6006 東京都港区赤坂1丁目12-32 アーク森ビル 7階 (JETRO本社（東京）)</p><p>​🎤 形式: 投資家パネル、基調講演、スタートアップピッチ、ネットワーキング</p><p>​🗣 言語: 日本語 &amp; 英語</p><p>​本イベントでは、TAISU VENTURES, SBI Investment、EMURGO Group、RYOBI、Hyperithm、HIRAC FUND - Money Forward Venture Partners などのTop Tierの投資家による率直なディスカッションや独占的なインサイトを提供します。また、以下のWeb3スタートアップも登壇予定です。</p><p>​参加スタートアップ:</p><p>​Coinstreet, Delabs Games, Flickplay, Helix, Movement Labs, Ongaeshi, OpenEden, Seaseed, Secured Finance, SONEX, Xociety, YOAKE entertainment, ZOTH など</p><p>​💡 アジェンダのハイライト:</p><p>​🔹 投資家パネル: Web3市場で活躍する投資家が最新トレンドを語る</p><p>​🔹 Taisuエコシステム発表: Movement Labsより最新のアップデートを発表</p><p>​🔹 スタートアップピッチセッション: Web3領域の最先端イノベーションを発掘</p><p>​🔹 ネットワーキング: 分散型未来を築く業界リーダーとつながるチャンス</p><p>​このイベントは、Web3領域における知見を深め、将来有望な投資機会を見極め、戦略的パートナーシップを構築したい方にとって必見の機会です。</p><p>​🚨 事前登録必須（当日参加不可） – 今すぐお申し込みください！</p><p>​<br>About <strong>Taisu Ventures:</strong><br>Taisu Ventures is a global Web3 venture capital firm with strong expertise in both finance and Web3. The firm has invested in over 100+ early-stage tech startups globally, building blockchain technologies across all chains in gaming, user platforms, DeFi, and infrastructure, and is actively investing in more. With a global outreach and presence in the US, Europe, and Asia, Taisu Ventures is deeply connected with Web3 communities across the global and remains committed to fostering the next generation of blockchain innovation.<br><a target="_blank" rel="noopener noreferrer" href="https://www.taisu.io/">https://www.taisu.io/</a><br><br>About <strong>Web3 Salon:</strong><br>Web3 Salon is a joint project of<a target="_blank" rel="nofollow noopener" href="https://asiaweb3alliance.jp/?utm_source=luma"> Asia Web3 Alliance Japan </a>and JETRO, connecting Web3 entrepreneurs, investors, and innovators to share knowledge and foster collaboration.<br><a target="_blank" rel="noopener noreferrer" href="https://web3salon.or.jp/">https://web3salon.or.jp/</a><br><br>About JETRO (Japan External Trade Organization): is a Japanese government-related organization that promotes trade and investment between Japan and the global market. It supports businesses by providing information, resources, and services to help them expand internationally, attract foreign investments, and strengthen global partnerships.<br><a target="_blank" rel="noopener noreferrer" href="https://www.jetro.go.jp/">https://www.jetro.go.jp/</a></p><p><strong>Location</strong></p><p>Please register to see the exact location of this event.</p>	2025-04-15	13:00 – 17:00 (JST), registration opens at 12:30	12‑32 Akasaka 1‑chōme, Minato‑ku, Tokyo 107‑6006, Japan	/images/d63e71ce-c430-4397-80a5-f5964dd4491c-5320891b.avif	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 05:59:27.525442+00	\N	[]	[]	https://luma.com/dlbc5mea	Register	Web3 investment & innovation summit connecting global investors and startups	Ark Mori Building, 7F (JETRO HQ)	\N	\N	[]	[]
5	Building Startup and Innovation Partnership	building-startup-and-innovation-partnership	​Connecting Pakistan and Japan Through Innovation, Investment, and Entrepreneurship	<p><strong>Building Startup and Innovation Partnerships</strong></p><p>​Connecting Pakistan and Japan Through Innovation, Investment, and Entrepreneurship</p><p>​📅 <strong>Date:</strong> 15 July 2026<br>🕒 <strong>Time:</strong> 3:00 PM – 5:30 PM<br>📍 <strong>Venue:</strong> Embassy of Pakistan, Tokyo</p><h2><strong>​About the Event</strong></h2><p>​Join government leaders, startup founders, investors, innovation organizations, and ecosystem builders from Pakistan and Japan for an exclusive forum focused on strengthening startup and innovation partnerships between the two countries.</p><p>​The event will explore opportunities for cross-border collaboration, startup investment, market access, corporate-startup partnerships, talent development, and innovation ecosystem growth. Participants will exchange insights and identify practical pathways to support entrepreneurs and emerging technology ventures while building long-term partnerships between Pakistan and Japan.</p><p>​This gathering aims to create meaningful connections between public and private sector stakeholders and encourage future collaboration in innovation, entrepreneurship, AI, Web3, and emerging technologies.</p>	2026-07-15	15:00 - 17:30	\N	/images/Pakistan-Japan-Growth-Startup-Innovation-Forum-2026-800-x-800-px--d3dedeff.png	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 02:18:12.545223+00	/images/Pakisatn-japan-Startup-building-92293244.png	[{"name": "Embassy of Pakistan, Tokyo", "tier": "Partner", "linkUrl": "https://mofa.gov.pk/tokyo"}]	[{"name": "Mr. Zarrar Hasham Khan", "role": "SECRETARY IT & TELECOMMUNICATION", "badge": "Panelist"}, {"name": "​Mr. Kawasaki Hideto", "role": "Parliamentary Vice-Minister for Digital Affairs, Japan", "badge": "Keynote", "linkUrl": "https://www.kawasakihideto.com/"}, {"name": "Mr. Abdul Hameed", "role": "Ambassador", "badge": "Keynote", "company": "Embassy of Pakistan, Tokyo"}]	https://luma.com/52igkx76	Request to Join	\N	Embassy of the Islamic Republic of Pakistan	\N	\N	[]	[]
1	Japan Financial Infrastructure Innovation Program Successfully Concluded During Japan Fintech Week 2026	japan-financial-infrastructure-innovation-program-successfully-concluded-during-	The Japan Financial Infrastructure Innovation Program (JFIIP), organized by AWAJ, Web3 Salon, and Ripple, successfully concluded during Japan Fintech Week 2026, bringing together leading startups, financial institutions, regulators, and global industry leaders to explore the future of digital finance, blockchain infrastructure, and institutional innovation.	<h3>Japan Financial Infrastructure Innovation Program (JFIIP)</h3><p>Held during Japan Fintech Week 2026 at JETRO Tokyo, the Japan Financial Infrastructure Innovation Program (JFIIP) brought together startups, financial institutions, investors, regulators, and global technology leaders to explore the future of digital finance and blockchain innovation.</p><p>Organized by Asia Web3 Alliance Japan (AWAJ), Web3 Salon, and Ripple, the program culminated in a Demo Day featuring 10 innovative startups:</p><p><strong>SuzuPay, NexBridge, LAPLACE, TRUSTAUTHY, Bankey, Kototsute, Seneca, MynaWallet, Green PowerLedger, and Solobank.</strong></p><p>The event also featured the <strong>Future of Finance Leadership Dialogue with executives from a16z, SMBC Nikko Securities, SBI Ripple Asia, Toyota Blockchain Lab, Securitize, LayerZero, and Ripple</strong>, discussing tokenization, digital assets, institutional blockchain adoption, and the future of financial infrastructure.</p><p>JFIIP demonstrated Japan's growing leadership in fintech and Web3 innovation while creating new opportunities for collaboration between startups, investors, corporations, and policymakers to build the next generation of financial services.</p>	2026-02-24	12:00 PM – 4:30 PM (JST)	Tokyo Headquarters	/images/jfiip-1--3e25c352.png	t	seed	2026-06-14 13:28:33.643371+00	/images/jfiip-1--f54b608a.png	[{"name": "Ripple", "tier": "Main Sponsor"}, {"name": "SMBC Nikko Securities", "tier": "Partner"}]	[{"name": "Hinza Asif", "role": "CEO", "badge": "Keynote", "company": "一般社団法人ASIA WEB3 ALLIANCE JAPAN"}]	https://luma.com/v5lnz8si	Request to Join	\N	\N	\N	View Agenda	[]	[{"time": "12-12:30", "title": "Registration and networking"}]
19	XRP Tokyo 2026	xrp-tokyo-2026	XRP Tokyo 2026 is Japan's largest conference dedicated to the XRP ecosystem, bringing together global leaders, developers, startups, investors, and enterprises. Explore the latest innovations in the XRP Ledger, institutional adoption, RWA tokenization, DeFi, and cross-border finance while connecting with the community shaping the future of the Internet of Value.\n	<p><strong>About XRP Tokyo</strong></p><p><strong>XRP Tokyo</strong> is Asia's premier conference dedicated to the XRP Ledger (XRPL) ecosystem, bringing together global industry leaders, developers, startups, investors, financial institutions, and enterprises to explore the future of blockchain-powered finance.</p><p>The conference showcases the latest advancements in the XRP Ledger, including institutional adoption, cross-border payments, tokenization of real-world assets (RWAs), decentralized finance (DeFi), stablecoins, and enterprise blockchain applications. Attendees gain exclusive insights from leading experts while connecting with the innovators shaping the next generation of digital finance.</p><p>More than just a conference, XRP Tokyo serves as a platform for collaboration, networking, and ecosystem growth—creating new partnerships, investment opportunities, and real-world use cases that accelerate the global adoption of XRPL.</p>	2026-04-07	\N	\N	/images/-2026-04-02-200930-1-ffa80664.png	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:39:56.889656+00	/images/-2026-04-02-200930-1-e5bda1c1.png	[{"name": "Ripple", "tier": "Sponsor", "linkUrl": "https://ripple.com/", "logoUrl": "/images/Screenshot-2026-06-28-161826-6c092cca.png"}, {"name": "SBI Group", "tier": "Sponsor", "linkUrl": "https://www.sbigroup.co.jp/", "logoUrl": "https://www.xrp-tokyo.io/sponsors/platinum/sbi-group.png"}, {"name": "Doppler Finance", "tier": "Sponsor", "linkUrl": "https://doppler.finance/", "logoUrl": "/images/Screenshot-2026-06-28-162035-58dd0381.png"}, {"name": "SBI Ripple Asia", "tier": "Sponsor", "linkUrl": "https://www.sbigroup.co.jp/company/group/sbirippleasia.html", "logoUrl": "https://www.xrp-tokyo.io/sponsors/gold/sbi-ripple-asia.png"}, {"name": "BITPoint", "tier": "Sponsor", "linkUrl": "https://www.bitpoint.co.jp/", "logoUrl": "/images/Screenshot-2026-06-28-162125-550ed027.png"}, {"name": "anodos", "tier": "Sponsor", "linkUrl": "https://anodos.finance/", "logoUrl": "/images/Screenshot-2026-06-28-162151-a9713291.png"}, {"name": "Datavault AI", "tier": "Sponsor", "linkUrl": "https://datavaultsite.com/", "logoUrl": "/images/Screenshot-2026-06-28-162328-1db30892.png"}, {"name": "楽天ウォレット", "tier": "Sponsor", "linkUrl": "https://www.rakuten-wallet.co.jp/", "logoUrl": "/images/Screenshot-2026-06-28-162410-ed372fe4.png"}, {"name": "yellow", "tier": "Sponsor", "linkUrl": "https://yellow.com/", "logoUrl": "/images/Screenshot-2026-06-28-162458-52985cbd.png"}, {"name": "RedotPay", "tier": "Sponsor", "linkUrl": "https://www.redotpay.com/", "logoUrl": "https://www.xrp-tokyo.io/sponsors/silver/redotpay.png"}, {"name": "XRPCafe", "tier": "Sponsor", "linkUrl": "https://xrp.cafe", "logoUrl": "/images/Screenshot-2026-06-28-162523-74b81d66.png"}, {"name": "Xaman", "tier": "Sponsor", "linkUrl": "https://xaman.app/", "logoUrl": "/images/Screenshot-2026-06-28-162608-f18b6f04.png"}, {"name": "Levtech", "tier": "Sponsor", "linkUrl": "https://levtech.jp/", "logoUrl": "/images/Screenshot-2026-06-28-162640-4e8b750b.png"}, {"name": "XRP Cloud", "tier": "Sponsor", "linkUrl": "https://xrp-cloud.xyz/en", "logoUrl": "/images/Screenshot-2026-06-28-162713-cf243206.png"}, {"name": "Giant Gox", "tier": "Sponsor", "linkUrl": "https://x.com/GiantGox", "logoUrl": "https://www.xrp-tokyo.io/sponsors/bronze/giantgox2.png"}, {"name": "メイフラちゃん", "tier": "Sponsor", "linkUrl": "https://x.com/mayflower3096", "logoUrl": "https://www.xrp-tokyo.io/sponsors/bronze/mayflower3096.jpg"}, {"name": "Daikoku", "tier": "Sponsor", "linkUrl": "https://x.com/daikokunet009", "logoUrl": "https://www.xrp-tokyo.io/partners/community/daikoku.png"}, {"name": "Hotei", "tier": "Sponsor", "linkUrl": "https://x.com/5porter5", "logoUrl": "https://www.xrp-tokyo.io/sponsors/bronze/hotei.png"}, {"name": "CoinPost", "tier": "Media", "linkUrl": "https://coinpost.jp/", "logoUrl": "https://www.xrp-tokyo.io/partners/media/coinpost.png"}, {"name": "あたらしい経済", "tier": "Media", "linkUrl": "https://www.neweconomy.jp/", "logoUrl": "/images/Screenshot-2026-06-28-162736-9c7b0891.png"}, {"name": "NADA NEWS", "tier": "Media", "linkUrl": "https://www.nadanews.com/", "logoUrl": "/images/Screenshot-2026-06-28-162803-62b1bba8.png"}, {"name": "IOLITE", "tier": "Media", "linkUrl": "https://iolite.net/", "logoUrl": "https://www.xrp-tokyo.io/partners/media/iolite.png"}, {"name": "HashHub", "tier": "Support Partner", "linkUrl": "https://hashhub.tokyo/", "logoUrl": "/images/Screenshot-2026-06-28-162824-6688dec4.png"}, {"name": "TDC", "tier": "Support Partner", "linkUrl": "https://digitalchamber.org/", "logoUrl": "/images/Screenshot-2026-06-28-162901-229e47fe.png"}, {"name": "ECCC", "tier": "Support Partner", "linkUrl": "https://bccc.global/", "logoUrl": "/images/Screenshot-2026-06-28-162955-68699530.png"}, {"name": "JBA", "tier": "Support Partner", "linkUrl": "https://jba-web.jp/", "logoUrl": "https://www.xrp-tokyo.io/partners/supporter/jba.png"}, {"name": "東大公開講座", "tier": "Support Partner", "linkUrl": "https://www.blockchain.t.u-tokyo.ac.jp/", "logoUrl": "https://www.xrp-tokyo.io/partners/education/東大公開講座.png"}, {"name": "AKINDO", "tier": "Support Partner", "linkUrl": "https://x.com/akindo_io/", "logoUrl": "/images/Screenshot-2026-06-28-163032-3ada1e46.png"}, {"name": "OffChain Tokyo", "tier": "Support Partner", "linkUrl": "https://luma.com/web3tokyo", "logoUrl": "/images/Screenshot-2026-06-28-163959-9d21b9fc.png"}, {"name": "Web3 Salon", "tier": "Support Partner", "linkUrl": "https://web3salon.or.jp/", "logoUrl": "/images/Screenshot-2026-06-28-164045-7bd85590.png"}, {"name": "渋谷Web3大学", "tier": "Support Partner", "linkUrl": "https://www.shibuyaweb3univ.com/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/渋谷Web3大学横.jpg"}, {"name": "Wave of Innovation", "tier": "Support Partner", "linkUrl": "https://www.waveofinnovation.com/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/wave-of-innovation.png"}, {"name": "XRPL Korea", "tier": "Support Partner", "linkUrl": "https://xrplkorea.org/", "logoUrl": "/images/Screenshot-2026-06-28-164114-3f44ffb9.png"}, {"name": "XRPL Africa", "tier": "Support Partner", "linkUrl": "https://x.com/XRPL_AF", "logoUrl": "https://www.xrp-tokyo.io/partners/community/xrpl-africa.jpg"}, {"name": "XRPL Canada", "tier": "Support Partner", "linkUrl": "https://www.xrplcanada.org/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/xrpl-canada.jpeg"}, {"name": "XRPL Malaysia", "tier": "Support Partner", "linkUrl": "https://x.com/xrplmalaysia", "logoUrl": "https://www.xrp-tokyo.io/partners/community/xrpl-malaysia.jpg"}, {"name": "OP Market", "tier": "Support Partner", "linkUrl": "https://opmarket.ai/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/opmarket.jpg"}, {"name": "YTTLINKS", "tier": "Support Partner", "linkUrl": "https://www.yttlinks.co.jp/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/YTTLINKS_logo_square.png"}, {"name": "Found", "tier": "Support Partner", "linkUrl": "https://www.dotfound.co.jp/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/Found.jpg"}, {"name": "0xConsultingGroup", "tier": "Support Partner", "linkUrl": "https://zero-x.com/en/home-en/", "logoUrl": "/images/Screenshot-2026-06-28-164144-8cfe6b6b.png"}, {"name": "collection logo", "tier": "Support Partner", "linkUrl": "https://x.com/pokemaru06", "logoUrl": "/images/Screenshot-2026-06-28-164615-d12e0cf8.png"}, {"name": "piyoneko", "tier": "Support Partner", "linkUrl": "https://x.com/jewelrycherry", "logoUrl": "https://www.xrp-tokyo.io/partners/community/piyoko_piyoneko(D) - piyoneko.png"}, {"name": "Crunk Cat collection", "tier": "Support Partner", "linkUrl": "https://x.com/Hammmnft", "logoUrl": "https://www.xrp-tokyo.io/partners/community/crunk_cat_collection_light.png"}, {"name": "OHAGI", "tier": "Support Partner", "linkUrl": "https://x.com/IKEMEN_KITA_san", "logoUrl": "https://www.xrp-tokyo.io/partners/community/ohagi.jpg"}, {"name": "AI Agent Run", "tier": "Support Partner", "linkUrl": "https://aigent.run/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/ai-agent-run1.png"}, {"name": "TextRP", "tier": "Support Partner", "linkUrl": "https://textrp.io/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/text-rp.jpg"}, {"name": "Wavee", "tier": "Support Partner", "linkUrl": "https://wavee.world/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/wavee-bg-white.png"}, {"name": "Terry Toto", "tier": "Support Partner", "linkUrl": "https://terrytoto.com/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/terry-toto.svg"}, {"name": "jupyter.org", "tier": "Support Partner", "linkUrl": "https://www.jupyter.co.jp/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/jupyter_logo_100kb.jpg"}, {"name": "Trust Authy", "tier": "Support Partner", "linkUrl": "https://trustauthy.jp/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/trust-authy.jpg"}, {"name": "TBV", "tier": "Support Partner", "linkUrl": "https://www.tbv.xyz/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/TBV_logo.svg"}, {"name": "TAKUMI", "tier": "Support Partner", "linkUrl": "https://chainofblockssummit.com/", "logoUrl": "/images/Screenshot-2026-06-28-164854-12b940dc.png"}, {"name": "xSPECTAR", "tier": "Support Partner", "linkUrl": "https://www.xspectar.com/", "logoUrl": "https://www.xrp-tokyo.io/partners/community/xspectar-logo.svg"}, {"name": "Rabbitflower", "tier": "Support Partner", "linkUrl": "https://x.com/RabiHouse", "logoUrl": "https://www.xrp-tokyo.io/partners/community/rabbitflower.png"}, {"name": "Yukki", "tier": "Support Partner", "linkUrl": "https://x.com/YukilovePenguin", "logoUrl": "https://www.xrp-tokyo.io/partners/community/yukki.png"}, {"name": "hayai-akachan", "tier": "Support Partner", "linkUrl": "https://x.com/hayaiakachan", "logoUrl": "https://www.xrp-tokyo.io/partners/community/hayai-akachan.png"}, {"name": "We Create 3", "tier": "Support Partner", "linkUrl": "https://x.com/We_Create_3", "logoUrl": "https://www.xrp-tokyo.io/partners/community/we-create-3.png"}, {"name": "XRP Army JP", "tier": "Support Partner", "linkUrl": "https://x.com/i/communities/2026168382178132057", "logoUrl": "https://www.xrp-tokyo.io/partners/community/xrp-army-jp.jpeg"}]	[{"name": "Markus Infanger", "role": "SVP, RippleX", "badge": "Speaker", "company": "Ripple", "linkUrl": "https://www.linkedin.com/in/markus-infanger-8a6ba747/", "imageUrl": "https://www.xrp-tokyo.io/Markus-Infanger.jpg"}, {"name": "Christina Chan", "role": "Senior Director, Ecosystem Growth Ripple", "badge": "Speaker", "company": "Ripple", "linkUrl": "https://www.linkedin.com/in/christinabchan", "imageUrl": "https://www.xrp-tokyo.io/Christina-Chan.jpg"}, {"name": "Tatsuya Yamada", "role": "President", "badge": "Speaker", "company": "Rakuten Wallet, Inc.", "linkUrl": "https://jp.linkedin.com/in/tatsuya-yamada-7223352a", "imageUrl": "https://www.xrp-tokyo.io/speakers/Tatsuya Yamada.png"}, {"name": "SungMo Park", "role": "Partner, Head of APAC GTM", "badge": "Speaker", "company": "A16z Crypto", "linkUrl": "https://www.linkedin.com/in/smp0910/", "imageUrl": "https://www.xrp-tokyo.io/speakers/SungMo Park.png"}, {"name": "Cody Carbone", "role": "CEO at The Digital Chamber", "badge": "Speaker", "company": "The Digital Chamber", "linkUrl": "https://www.linkedin.com/in/codycarbone/", "imageUrl": "https://www.xrp-tokyo.io/speakers/cody-carbone1.jpg"}, {"name": "Takuya Sugiyama", "role": "Vice President, SBI Ripple Asia", "badge": "Speaker", "company": "SBI Holdings", "linkUrl": "https://www.linkedin.com/in/takuya-sugiyama-aa1b73a", "imageUrl": "https://www.xrp-tokyo.io/Takuy-Sugiyama.jpg"}, {"name": "Tomohiko Kondo", "role": "CEO", "badge": "Speaker", "company": "SBI VC Trade Co., Ltd.", "linkUrl": "https://jp.linkedin.com/in/tomohiko-kondo-78748bab", "imageUrl": "https://www.xrp-tokyo.io/speakers/Tomohiko Kondo.png"}, {"name": "Dave McCombs", "role": "Senior Re-Writer", "badge": "Speaker", "company": "NHK World Japan", "linkUrl": "https://www.linkedin.com/in/dave-mccombs-1b0177/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Dave-McComb.png"}, {"name": "Hirokuni Onozawa", "role": "Executive Officer", "badge": "Speaker", "company": "GMO Aozora Net Bank, Ltd.", "linkUrl": "https://gmo-aozora.com/", "imageUrl": "https://www.xrp-tokyo.io/speakers/hirokuni_onozawa.png"}, {"name": "Seihaku Yoshida", "role": "CEO", "badge": "Speaker", "company": "HashPort Inc.", "linkUrl": "https://x.com/seihakuyoshida", "imageUrl": "https://www.xrp-tokyo.io/speakers/HashPort Inc.png"}, {"name": "Takafumi Shimoyama", "role": "General Manager, Head of Business Development", "badge": "Speaker", "company": "SBI Ripple Asia", "linkUrl": "https://jp.linkedin.com/in/takafumi-shimoyama-43b949207", "imageUrl": "https://www.xrp-tokyo.io/speakers/Takafumi Shimoyama.png"}, {"name": "Toshinari Shinohara", "role": "Director, Future Co-Creation Lab, General Management Division", "badge": "Speaker", "company": "TOBU TOP TOURS", "linkUrl": "https://www.tobutoptours.co.jp/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Toshinari Shinohara.png"}, {"name": "Meg Nakamura", "role": "Chief Operating Officer", "badge": "Speaker", "company": "Evernorth", "linkUrl": "https://www.linkedin.com/in/megnakamura", "imageUrl": "https://www.xrp-tokyo.io/speakers/Meg Nakamura.png"}, {"name": "Mai Furukawa", "role": "Director of XRPL Japan Association and Support at XRPL Labs", "badge": "Speaker", "company": "XRPL Japan/XRPL Labs", "linkUrl": "https://www.linkedin.com/in/mai-furukawa-b26079281/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Mai Furukawa1.png"}, {"name": "Hinza Asif", "role": "President", "badge": "Speaker", "company": "Asia Web3 Alliance Japan", "linkUrl": "https://jp.linkedin.com/in/hinza-asif", "imageUrl": "https://www.xrp-tokyo.io/speakers/Hinza Asif.png"}, {"name": "Noritaka Okabe", "role": "Founder & CEO", "badge": "Speaker", "company": "JPYC Inc.", "linkUrl": "https://x.com/noritaka_okabe", "imageUrl": "https://www.xrp-tokyo.io/speakers/Noritaka Okabe.png"}, {"name": "Ryo Kato", "role": "CEO", "badge": "Speaker", "company": "HashHub Inc.", "linkUrl": "https://x.com/kitaro_sskr", "imageUrl": "https://www.xrp-tokyo.io/speakers/Ryo Kato.png"}, {"name": "Fumihiro Arasawa", "role": "CEO, XWIN Group Chair, DeFi Committee", "badge": "Speaker", "company": "Blockchain Collaborative Consortium", "linkUrl": "https://bccc.global/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Fumihiro Arasawa.png"}, {"name": "Nathaniel T. Bradley", "role": "CEO", "badge": "Speaker", "company": "Datavault AI", "linkUrl": "https://www.linkedin.com/in/natlink/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Nathaniel.png"}, {"name": "Steven Zeiler", "role": "Developer Evangelist", "badge": "Speaker", "company": "Yellow", "linkUrl": "https://www.linkedin.com/in/stevenzeiler/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Steven Zeiler.png"}, {"name": "Go Makino", "role": "Regional Director", "badge": "Speaker", "company": "Fireblocks Japan", "linkUrl": "https://www.linkedin.com/in/gou-makino-b362854b/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Go Makino.png"}, {"name": "Taisuke Isono", "role": "Head of Nikko Innovation Lab", "badge": "Speaker", "company": "SMBC Nikko Securities Inc.", "linkUrl": "https://www.smbcnikko.co.jp/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Taisuke Isono.png"}, {"name": "Eiji Kobayashi", "role": "Director & Country Head", "badge": "Speaker", "company": "Securitize Japan", "linkUrl": "https://securitize.co.jp/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Eiji Kobayashi.png"}, {"name": "Ken Kawai", "role": "Advisor Partner Lawyer", "badge": "Speaker", "company": "Anderson Mori & Tomotsune", "linkUrl": "https://www.amt-law.com/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Ken Kawai.png"}, {"name": "Seiichi Kawamura", "role": "Strategic Planning Dept", "badge": "Speaker", "company": "Blockchain Group Toyota Blockchain Lab", "linkUrl": "https://www.toyota-blockchain-lab.org/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Seiichi Kawamura.png"}, {"name": "Tatsuya Kohrogi", "role": "Senior Ecosystem Growth Manager", "badge": "Speaker", "company": "Ripple", "linkUrl": "https://sg.linkedin.com/in/tatsuya-kohrogi", "imageUrl": "https://www.xrp-tokyo.io/speakers/Tatsuya Kohrogi.png"}, {"name": "Yoshimasa Satoh", "role": "CFA Representative Director and CEO, Japan", "badge": "Speaker", "company": "Alpaca", "linkUrl": "https://www.linkedin.com/in/yoshimasa-satoh-cfa-84b6b92b/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Yoshimasa Satoh.png"}, {"name": "Masa Kikuchi", "role": "Founder & CEO", "badge": "Speaker", "company": "Secured Finance", "linkUrl": "https://www.linkedin.com/in/masa-senshi-kikuchi-55185a23/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Masa Kikuchi.png"}, {"name": "Yusuke Takezawa", "role": "Independent Advisor on Cross-Border Finance and Institutional Design, Former VP at Progmat", "badge": "Speaker", "linkUrl": "https://www.linkedin.com/in/yusuke-takezawa-327720156/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Yusuke Takezawa.jpg"}, {"name": "Noriaki Yagi", "role": "Editor-in-chief", "badge": "Speaker", "company": "Iolite Magazine", "linkUrl": "https://iolite.net/magazine", "imageUrl": "https://www.xrp-tokyo.io/speakers/Noriaki Yagi.png"}, {"name": "Ryo Sakai", "role": "Head of Business Development & CEO", "badge": "Speaker", "company": "CoinPost, WebX", "linkUrl": "https://x.com/RyosCoinPost", "imageUrl": "https://www.xrp-tokyo.io/speakers/Ryo Sakai.png"}, {"name": "Cyrus Cruz", "role": "APAC Head", "badge": "Speaker", "company": "Tenity", "linkUrl": "https://www.linkedin.com/in/cyruscruz8/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Cyrus Cruz.png"}, {"name": "Sojun Katsura", "role": "Director", "badge": "Speaker", "company": "Papi Code", "imageUrl": "https://www.xrp-tokyo.io/speakers/Sojun Katsura.png"}, {"name": "Ai Kosuke", "role": "Founder", "badge": "Speaker", "company": "SuzuPay", "linkUrl": "https://suzupay.com/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Ai Kosuke.png"}, {"name": "Ikkei Matsuda", "role": "Representative Director & CEO", "badge": "Startup Founder", "company": "Digital Platformer Co., Ltd.", "linkUrl": "https://www.linkedin.com/in/ikkei-matsuda-74549735/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Matsuda Ikkei.png"}, {"name": "Jean Zhu", "role": "Co Founder", "badge": "Startup Founder", "company": "Nexbridge", "linkUrl": "https://www.linkedin.com/in/jean-zhu-966b7754/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Jean Zhu.png"}, {"name": "Yusuke Hirota", "role": "Founder", "badge": "Startup Founder", "company": "Laplace", "imageUrl": "https://www.xrp-tokyo.io/speakers/Yusuke Hirota.png"}, {"name": "Eri Ishiyama", "role": "Blockchain Advocate", "badge": "Startup Founder", "linkUrl": "https://x.com/sentosumosaba", "imageUrl": "https://www.xrp-tokyo.io/speakers/Carpe Diem.png"}, {"name": "Sebastian Valdez", "role": "Co-Founder", "badge": "Startup Founder", "company": "xrp.cafe", "linkUrl": "https://xrp.cafe/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Sebastian Valdez.png"}, {"name": "Kyohei Shibano", "role": "Project Researcher", "badge": "Speaker", "company": "The University of Tokyo", "linkUrl": "https://www.linkedin.com/in/kyohei-shibano-0a5165251", "imageUrl": "https://www.xrp-tokyo.io/speakers/Tokyo University.png"}, {"name": "Rox Park", "role": "Head of Institutions", "badge": "Startup Founder", "company": "Doppler Finance", "linkUrl": "https://doppler.finance/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Doppler.png"}, {"name": "Panos Mekras", "role": "Co-Founder & CEO", "badge": "Startup Founder", "company": "Anodos Labs", "linkUrl": "https://www.linkedin.com/in/panos-mekras/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Anodos Finance.png"}, {"name": "J. Ayo Akinyele", "role": "Head of Engineering", "badge": "Speaker", "company": "RippleX", "linkUrl": "https://x.com/ja_akinyele", "imageUrl": "https://www.xrp-tokyo.io/speakers/Ayo Akinyele.png"}, {"name": "Robert Kiuru", "role": "COO", "badge": "Startup Founder", "company": "Xaman", "linkUrl": "https://www.linkedin.com/in/kiuru1/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Xaman.png"}, {"name": "Alexis Sirkia", "role": "Executive Chairman & Founder", "badge": "Startup Founder", "company": "Yellow", "linkUrl": "https://www.linkedin.com/in/sirkia/", "imageUrl": "https://www.xrp-tokyo.io/speakers/Alexis Sirkia.png"}]	https://www.xrp-tokyo.io/	https://www.xrp-tokyo.io/	Asia's largest XRP conference	Happo-en Tokyo	\N	https://www.xrp-tokyo.io/agenda	[]	[{"time": "10:30 AM - 10:35 AM", "title": "Welcome Note", "description": "Mai Furukawa\\nDirector of XRPL Japan Association and Support at XRPL Labs\\nXRPL Japan/XRPL Labs"}, {"time": "10:35 AM - 11:00 AM", "title": "Scaling the Internet of Value with XRP: Building the Next Global Financial Infrastructure"}]
20	Executive Leadership Discussion on the Digital Economy	executive-leadership-discussion-on-the-digital-economy	**Executive Leadership Dialogue on the Digital Economy** is an exclusive, invitation-only gathering of government leaders, investors, corporate executives, founders, and innovators to discuss the future of the digital economy, AI, Web3, and global innovation. The session is designed to foster high-level dialogue, strategic partnerships, and meaningful cross-border collaboration in a private executive setting.\n	<p><strong>Executive Leadership Dialogue on the Digital Economy</strong></p><p>​Private | Invitation Only</p><p>​An exclusive closed-door discussion bringing together selected speakers and VIP guests to exchange insights on the future of the global digital economy. The session provides a private environment for executive-level conversations, strategic networking, and collaboration among government leaders, industry executives, investors, founders, and innovation leaders.</p><p>​Attendance</p><p>​<strong>Access is strictly limited to:</strong></p><ul><li><p>​Speakers</p></li><li><p>​VIP Pass Holders</p></li><li><p>​Invite Only</p></li></ul><p>​Attendance is by invitation only. Seating is limited to maintain a focused and high-level executive discussion to encourage meaningful conversations and valuable networking among participants.</p><p>​</p><p>​About AWAJ</p><p>​<a target="_blank" rel="nofollow noopener" href="https://asiaweb3alliance.jp/?utm_source=luma"><strong>Asia Web3 Alliance Japan</strong></a><strong> (AWAJ)</strong> is a non-profit industry association dedicated to connecting startups, investors, corporations, and government organizations across Japan and the global innovation ecosystem. AWAJ promotes international collaboration, supports emerging technologies including AI and Web3, and creates opportunities for cross-border investment, business expansion, and ecosystem development.</p><p>​About TET Capital</p><p>​<a target="_blank" rel="nofollow noopener" href="https://tetcapital.jp/?utm_source=luma"><strong>TET Capital</strong></a> is a venture capital and strategic investment firm focused on supporting high-growth technology companies. The firm works closely with founders, investors, and industry leaders to accelerate innovation, facilitate strategic partnerships, and help promising startups scale in global markets.</p><p>​Venue :</p><p>​<strong>Venue:</strong> WebX Area , Web3 Salon | AWAJ Room</p><p><br></p>	2026-07-13	14:30 – 17:00 (JST)	\N	/images/ChatGPT-Image-Jun-30-2026-05_39_54-PM-e4f6854a.png	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-10 08:40:43.067706+00	/images/Executive-Leadership-Discussion-on-the-Digital-Economy-web3-salon-fe789a29.png	[]	[]	https://luma.com/eg7k64cz	Request to Join	\N	The Prince Park Tower Tokyo	https://images.lumacdn.com/uploads/9h/9bd6bc5f-0ede-4158-a903-9dc852f28bd6.gif	\N	[]	[]
21	Digital Investment Forum |DIF 2027	digital-investment-forum-dif-2027	AWAJ Digital Investment Forum 2027 is Japan's premier international platform connecting global investors, financial institutions, governments, startups, and technology leaders to shape the future of digital finance, AI, tokenization, digital assets, and global capital formation. Join industry pioneers for high-level discussions, investment opportunities, strategic partnerships, and exclusive networking in Tokyo.	<p><strong>AWAJ Digital Investment Forum (DIF) 2027</strong> is Japan's premier international platform bringing together global investors, financial institutions, governments, policymakers, startups, and technology leaders to shape the future of digital finance and investment.</p><p>The forum focuses on <strong>Digital Assets, AI, Tokenization (RWA), Stablecoins, Venture Capital, Institutional Finance, Prediction Markets, Digital Infrastructure, and Cross-border Investment</strong>, creating a unique environment for investment, policy dialogue, strategic partnerships, and business expansion.</p><p>Held in <strong>Tokyo on April 5, 2027</strong>, AWAJ DIF connects global capital with innovation through keynote speeches, executive panels, an international exhibition, startup showcases, and exclusive networking with industry leaders.<br>----------------<br><strong>AWAJデジタル・インベストメント・フォーラム（DIF）2027</strong> は、デジタルファイナンスと投資の未来を創造するため、世界中の投資家、金融機関、政府関係者、政策立案者、スタートアップ、そしてテクノロジーリーダーが集結する、日本を代表する国際フォーラムです。</p><p>本フォーラムでは、<strong>デジタルアセット、AI、トークン化（RWA）、ステーブルコイン、ベンチャーキャピタル、機関投資・金融、プレディクションマーケット、デジタルインフラ、クロスボーダー投資</strong> を主要テーマとし、投資機会の創出、政策対話、戦略的パートナーシップ、そしてグローバルなビジネス展開を促進する場を提供します。</p><p><strong>2027年4月5日に東京で開催</strong>される AWAJ DIF 2027 では、基調講演、エグゼクティブ・パネルディスカッション、国際展示会、スタートアップ・ショーケース、そして業界を代表するリーダーとのエグゼクティブ・ネットワーキングを通じて、世界の資本とイノベーションを結びつけます。</p>	2027-04-05	09:00-5:30pm	Tokyo Japan 	/images/AWAJ-Digital-investment-forum-2027-b2-1e68f33b.png	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-08-07 17:18:54.599963+00	/images/AWAJ-Digital-investment-forum-2027-940b7b8f.png	[]	[]	\N	\N	AWAJ | DIF 2027	TBA	\N	View Agenda	[]	[{"time": "9:30 AM – 5:30 PM", "title": "Conference", "description": "Keynote speeches, government policy sessions, executive panels, startup pitches, and investment discussions on Digital Assets, AI, Tokenization, and Global Finance."}, {"time": "9:30 AM – 5:30 PM", "title": "Exhibition", "description": "Meet 50+ leading companies, explore innovative technologies, discover investment opportunities, and connect with global partners throughout the day."}, {"time": "7:30 PM – 9:00 PM", "title": "VVIP Dinner (Invitation Only)", "description": "An exclusive executive dinner featuring keynote speakers, policymakers, investors, sponsors, and private networking with distinguished guests."}]
\.


--
-- Data for Name: events_organizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events_organizations (id, event_id, organization_id, role_at_event, sort_order, created_at) FROM stdin;
551	2	3	\N	2	2026-07-11 07:12:13.607282
554	2	6	\N	5	2026-07-11 07:12:13.607282
555	2	125	\N	6	2026-07-11 07:12:13.607282
556	2	126	\N	7	2026-07-11 07:12:13.607282
557	2	9	\N	8	2026-07-11 07:12:13.607282
558	2	121	\N	9	2026-07-11 07:12:13.607282
559	2	11	\N	10	2026-07-11 07:12:13.607282
560	5	127	\N	0	2026-07-11 07:12:13.614316
562	1	109	\N	1	2026-07-11 07:12:13.626137
564	19	12	\N	1	2026-07-11 07:12:13.731896
565	19	13	\N	2	2026-07-11 07:12:13.731896
566	19	14	\N	3	2026-07-11 07:12:13.731896
567	19	15	\N	4	2026-07-11 07:12:13.731896
568	19	16	\N	5	2026-07-11 07:12:13.731896
569	19	17	\N	6	2026-07-11 07:12:13.731896
570	19	18	\N	7	2026-07-11 07:12:13.731896
571	19	19	\N	8	2026-07-11 07:12:13.731896
572	19	20	\N	9	2026-07-11 07:12:13.731896
573	19	21	\N	10	2026-07-11 07:12:13.731896
574	19	22	\N	11	2026-07-11 07:12:13.731896
575	19	23	\N	12	2026-07-11 07:12:13.731896
576	19	24	\N	13	2026-07-11 07:12:13.731896
577	19	25	\N	14	2026-07-11 07:12:13.731896
578	19	26	\N	15	2026-07-11 07:12:13.731896
579	19	27	\N	16	2026-07-11 07:12:13.731896
580	19	28	\N	17	2026-07-11 07:12:13.731896
581	19	29	\N	18	2026-07-11 07:12:13.731896
582	19	30	\N	19	2026-07-11 07:12:13.731896
583	19	31	\N	20	2026-07-11 07:12:13.731896
584	19	32	\N	21	2026-07-11 07:12:13.731896
585	19	33	\N	22	2026-07-11 07:12:13.731896
586	19	34	\N	23	2026-07-11 07:12:13.731896
587	19	35	\N	24	2026-07-11 07:12:13.731896
588	19	36	\N	25	2026-07-11 07:12:13.731896
589	19	37	\N	26	2026-07-11 07:12:13.731896
590	19	38	\N	27	2026-07-11 07:12:13.731896
591	19	39	\N	28	2026-07-11 07:12:13.731896
592	19	40	\N	29	2026-07-11 07:12:13.731896
593	19	41	\N	30	2026-07-11 07:12:13.731896
594	19	42	\N	31	2026-07-11 07:12:13.731896
595	19	43	\N	32	2026-07-11 07:12:13.731896
596	19	44	\N	33	2026-07-11 07:12:13.731896
597	19	45	\N	34	2026-07-11 07:12:13.731896
598	19	46	\N	35	2026-07-11 07:12:13.731896
599	19	47	\N	36	2026-07-11 07:12:13.731896
600	19	48	\N	37	2026-07-11 07:12:13.731896
601	19	49	\N	38	2026-07-11 07:12:13.731896
603	19	52	\N	40	2026-07-11 07:12:13.731896
604	19	53	\N	41	2026-07-11 07:12:13.731896
605	19	54	\N	42	2026-07-11 07:12:13.731896
606	19	55	\N	43	2026-07-11 07:12:13.731896
607	19	56	\N	44	2026-07-11 07:12:13.731896
608	19	57	\N	45	2026-07-11 07:12:13.731896
609	19	58	\N	46	2026-07-11 07:12:13.731896
610	19	59	\N	47	2026-07-11 07:12:13.731896
611	19	129	\N	48	2026-07-11 07:12:13.731896
612	19	61	\N	49	2026-07-11 07:12:13.731896
613	19	62	\N	50	2026-07-11 07:12:13.731896
614	19	63	\N	51	2026-07-11 07:12:13.731896
615	19	64	\N	52	2026-07-11 07:12:13.731896
616	19	65	\N	53	2026-07-11 07:12:13.731896
617	19	66	\N	54	2026-07-11 07:12:13.731896
618	19	67	\N	55	2026-07-11 07:12:13.731896
619	19	68	\N	56	2026-07-11 07:12:13.731896
620	19	69	\N	57	2026-07-11 07:12:13.731896
460	7	71	\N	1	2026-07-07 15:59:47.319749
621	20	135	\N	0	2026-07-12 05:28:44.205997
462	8	109	\N	0	2026-07-07 16:06:13.002222
622	2	5	\N	0	2026-07-14 17:58:59.100847
623	19	1	\N	0	2026-07-14 18:02:15.16322
624	1	1	\N	1	2026-07-14 18:02:15.16322
625	2	1	\N	2	2026-07-14 18:02:15.16322
626	2	124	\N	0	2026-07-14 18:05:32.26193
628	2	123	\N	0	2026-07-14 18:09:43.428939
\.


--
-- Data for Name: events_people; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events_people (id, event_id, person_id, role_at_event, sort_order, created_at) FROM stdin;
623	19	29	Speaker	0	2026-06-28 07:49:14.53066
624	19	30	Speaker	1	2026-06-28 07:49:14.53066
625	19	31	Speaker	2	2026-06-28 07:49:14.53066
626	19	73	Speaker	3	2026-06-28 07:49:14.53066
627	19	33	Speaker	4	2026-06-28 07:49:14.53066
628	19	34	Speaker	5	2026-06-28 07:49:14.53066
629	19	35	Speaker	6	2026-06-28 07:49:14.53066
630	19	36	Speaker	7	2026-06-28 07:49:14.53066
631	19	37	Speaker	8	2026-06-28 07:49:14.53066
632	19	38	Speaker	9	2026-06-28 07:49:14.53066
11	5	20	Panelist	0	2026-06-23 03:57:48.230902
12	5	21	Keynote	1	2026-06-23 03:57:48.230902
13	5	22	Keynote	2	2026-06-23 03:57:48.230902
14	1	10	Keynote	0	2026-06-23 03:58:55.006882
633	19	39	Speaker	10	2026-06-28 07:49:14.53066
634	19	40	Speaker	11	2026-06-28 07:49:14.53066
635	19	41	Speaker	12	2026-06-28 07:49:14.53066
636	19	42	Speaker	13	2026-06-28 07:49:14.53066
637	19	10	Speaker	14	2026-06-28 07:49:14.53066
638	19	43	Speaker	15	2026-06-28 07:49:14.53066
639	19	44	Speaker	16	2026-06-28 07:49:14.53066
640	19	45	Speaker	17	2026-06-28 07:49:14.53066
641	19	46	Speaker	18	2026-06-28 07:49:14.53066
642	19	47	Speaker	19	2026-06-28 07:49:14.53066
643	19	48	Speaker	20	2026-06-28 07:49:14.53066
644	19	49	Speaker	21	2026-06-28 07:49:14.53066
645	19	50	Speaker	22	2026-06-28 07:49:14.53066
646	19	51	Speaker	23	2026-06-28 07:49:14.53066
647	19	52	Speaker	24	2026-06-28 07:49:14.53066
648	19	53	Speaker	25	2026-06-28 07:49:14.53066
649	19	54	Speaker	26	2026-06-28 07:49:14.53066
650	19	55	Speaker	27	2026-06-28 07:49:14.53066
651	19	56	Speaker	28	2026-06-28 07:49:14.53066
652	19	57	Speaker	29	2026-06-28 07:49:14.53066
653	19	58	Speaker	30	2026-06-28 07:49:14.53066
654	19	59	Speaker	31	2026-06-28 07:49:14.53066
655	19	60	Speaker	32	2026-06-28 07:49:14.53066
656	19	61	Speaker	33	2026-06-28 07:49:14.53066
657	19	74	Startup Founder	34	2026-06-28 07:49:14.53066
658	19	63	Startup Founder	35	2026-06-28 07:49:14.53066
659	19	64	Startup Founder	36	2026-06-28 07:49:14.53066
660	19	65	Startup Founder	37	2026-06-28 07:49:14.53066
661	19	66	Startup Founder	38	2026-06-28 07:49:14.53066
662	19	67	Speaker	39	2026-06-28 07:49:14.53066
663	19	69	Startup Founder	40	2026-06-28 07:49:14.53066
664	19	68	Startup Founder	41	2026-06-28 07:49:14.53066
665	19	70	Speaker	42	2026-06-28 07:49:14.53066
666	19	71	Startup Founder	43	2026-06-28 07:49:14.53066
667	19	72	Startup Founder	44	2026-06-28 07:49:14.53066
\.


--
-- Data for Name: galleries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.galleries (id, title, description, category, cover_image_url, photos, event_date, is_featured, sort_order, author_id, created_at, location) FROM stdin;
\.


--
-- Data for Name: japan_hub_applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.japan_hub_applications (id, company, country, website, founder_name, email, phone, industry, funding_stage, team_size, message, deck_url, is_read, created_at, status) FROM stdin;
1	Nebula Labs	Singapore	\N	Aiko Tanaka	aiko@nebula.test	\N	AI	\N	\N	\N	\N	f	2026-07-03 13:03:12.374904	new
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (id, title, type, url, thumbnail_url, source, excerpt, program_id, is_featured, published_at, sort_order, author_id, created_at, logo_url) FROM stdin;
15	IT Committee event: Investing in the Future of Blockchain and AI, October 10, 2024	Video	https://youtu.be/zEducRHucpY?si=6lGibA4yxCACKcil	/images/Screenshot-2026-06-20-041234-f15aa279.png	\N	\N	\N	t	2026-06-19 19:11:06.92523+00	8	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 19:11:06.92523+00	/images/left-7c5b0bd4.jpg
5	The Decentralized Media Platform - 	Video	https://youtu.be/gdAlM7wF5L4?si=kG_X17OPNBmSv3yS	/images/Screenshot-2026-06-20-033318-63e3dec1.png	Brave New Coin	\N	\N	f	2026-06-19 18:34:44.18499+00	10	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 18:34:44.18499+00	/images/Screenshot-2026-06-20-124637-8f48760a.png
2	Asia Web3 Alliance proposes US-Japan collaboration on tokenization	Report	https://youtu.be/yk0DBtxLzCA?si=JoTrW7Gdvi8NY8Xw&t=670	/images/Screenshot-2026-06-20-013839-9ea31a00.png	Coin Bureau	The Asia Web3 Alliance Japan has submitted a proposal to the U.S. Securities and Exchange Commission’s Crypto Task Force, advocating for a strategic collaboration on tokenization and Web3 regulation.\n\nThe proposal sent to the SEC calls for a joint effort between the SEC, Japan’s Financial Services Agency, the Ministry of Economy, Trade and Industry, and the Bank of Japan to establish regulatory clarity and foster interoperability between the two markets.	\N	t	2026-06-14 16:26:03.373406+00	2	seed	2026-06-14 16:26:03.373406+00	/images/Screenshot-2026-06-20-124059-d5796a6e.png
3	Asia Web3 Alliance Japan collaborates with Tokyo Innovation Base, operated by the Tokyo Metropolitan Government, to strengthen the Web3 startup ecosystem.	Press Release	https://prtimes.jp/main/html/rd/p/000000017.000159007.html	/images/1779176063725-d0f1c932.jpeg	PR Times	Asia Web3 Alliance Japan (AWAJ) is pleased to announce its official participation as a partner of Tokyo Innovation Base (TIB), a major startup support hub operated by the Tokyo Metropolitan Government. This partnership will accelerate Web3 innovation and startup development in Japan and represent an important step towards establishing TIB as a global hub.	\N	t	2026-06-14 16:26:03.373406+00	3	seed	2026-06-14 16:26:03.373406+00	/images/PRTIMES_logo_fix_RGB-230ccddb.png
8	AWAJ - Digital Chamber Collaboration	Video	https://www.youtube.com/watch?v=kpggmLwFqo0	/images/Screenshot-2026-06-20-033842-2f015b40.png	XRP Tokyo	\N	\N	t	2026-06-19 18:39:50.403748+00	5	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 18:39:50.403748+00	/images/Screenshot-2026-06-20-124321-fe758f14.png
7	ICP Japan Launch and Partner Ecosystem Development in Japan (with Dfinity Foundation and HUBs/Asia Alliances worldwide)	Video	https://youtu.be/fiQywTlPo3I?si=hY8EM9bFDzIPMkdl	/images/Screenshot-2026-06-20-033643-b2607a5f.png	ICP Japan	\N	\N	t	2026-06-19 18:37:44.035255+00	8	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 18:37:44.035255+00	/images/ICPJapan-_new_--adb0a4d1.avif
9	AWAJ Keynote at Web3 Tokyo	Video	https://youtu.be/aaexOuACqoQ?si=M7i38MnmaQghWm6p&t=14730	/images/Screenshot-2026-06-20-034111-3f4b5a8e.png	web3 Tokyo	\N	\N	f	2026-06-19 18:42:18.464416+00	15	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 18:42:18.464416+00	/images/Screenshot-2026-06-20-124918-4a5af94c.png
12	XRP Tokyo Clossing message from Hinza Asif	Video	https://youtu.be/0IqZuy-Ytjo?si=B12AhYNUAt6dduyp&t=54	/images/Screenshot-2026-06-20-040121-ee86c5aa.png	XRP Tokyo	\N	\N	t	2026-06-19 19:01:50.448384+00	6	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 19:01:50.448384+00	/images/Screenshot-2026-06-20-124321-198e5fde.png
1	Japan moves to regulate crypto like stocks in market growth push	Article	https://www.bloomberg.com/news/articles/2026-06-11/japan-moves-to-regulate-crypto-like-stocks-in-market-growth-push?srnd=undefined	/images/bloomberg-hinza-asif-1--mqn8td6i.png	BLOOMBERG	Japan's commitment to regulatory clarity and strong enforcement continues to strengthen confidence in the digital asset sector. According to Hinza Asif, President of Asia Web3 Alliance Japan, clear rules and consistent oversight help create a trusted environment for investors, institutions, and legitimate market participants, reinforcing Japan's position as one of the world's most respected crypto markets.	\N	t	2026-06-14 16:26:03.373406+00	1	seed	2026-06-14 16:26:03.373406+00	/images/Bloomberg_Black_Logo-mqn8spdn.jpg
4	Asia Web3 Alliance Japan has signed a technical support partnership with SBI Ripple Asia to accelerate the practical application of blockchain-based financial services.	Press Release	https://www.sbigroup.co.jp/news/pr/2026/0220_16124.html	/images/Screenshot-2026-06-20-020947-b37ad485.png	SIB Ripple Asia	• Asia Web3 Alliance Japan has signed a basic agreement with SBI Ripple Asia regarding a technical support partnership.\n\n• Through SBI Ripple Asia's technical support, which takes into account regulatory compliance, operational design, and business viability, we are creating a supportive environment for startups aiming to implement financial services utilizing blockchain technology.\n\n• As for blockchain technology, we envision using "XRP Ledger (hereinafter "XRPL") *1," which is being increasingly implemented by financial institutions worldwide.	\N	t	2026-06-19 17:10:25.038883+00	4	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 17:10:25.038883+00	/images/Screenshot-2026-06-20-020947-dce18506.png
10	Startup Pitch - Japan Hub Token 2025 Singapore	Video	https://www.youtube.com/watch?v=GQi5wThFCJk	/images/Screenshot-2026-06-20-034718-e712a161.png	Token2025	\N	\N	t	2026-06-19 18:50:10.041157+00	6	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 18:50:10.041157+00	/images/Screenshot-2026-06-20-124429-565f1281.png
11	XRPL Startup Ecosystem build by AWAJ	Video	https://youtu.be/T7HQfUpBcjQ?si=Favw6n5ddXLj-UnJ&t=684	/images/Screenshot-2026-06-20-035204-44615d86.png	XRPL Tokyo	The XRPL Startup Ecosystem Program is an initiative developed by AWAJ and endorsed by Christina, Director of Ecosystem Growth at Ripple, to support startup innovation and ecosystem development on the XRP Ledger.	\N	t	2026-06-19 18:53:00.058481+00	7	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 18:53:00.058481+00	/images/Screenshot-2026-06-20-124321-6ed45572.png
13	Japan's Blockchain Ecosystem: Local Strength, Global Ambition, Hinza Asif and Yusuke Kaga	Video	https://youtu.be/pFWczWBhIQc?si=prwTdhK6Kxjttr38	/images/Screenshot-2026-06-20-040507-1e2f5ab4.png	\N	\N	\N	t	2026-06-19 19:07:03.360611+00	9	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 19:07:03.360611+00	/images/VDe6l6OCk-hZkpN2uTZoYojx2iZ2IRXts0_fuc9Oj6E-1--a5349a1e.jfif
6	Osaka Expo 2025: Hinza Asif Talks with Rep. Nobuyuki Baba on Web3, Tech & Japan’s Future	Video	https://www.youtube.com/watch?v=HTnhByeYnBc	/images/Screenshot-2026-06-20-033558-3e819671.png	The Foreign Correspondents' Club of Japan | FCCJ	\N	\N	t	2026-06-19 18:36:10.957576+00	9	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 18:36:10.957576+00	/images/left-03e4e225.jpg
16	IT Committee event: Supporting News Media with Web3 and AI Technology	Video	https://www.youtube.com/watch?v=Iva6PWcDk3g	/images/Screenshot-2026-06-20-041052-36544ec8.png	日本外国特派員協会 オフィシャルサイトFCCJchannel	\N	\N	t	2026-06-19 19:13:19.640919+00	11	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 19:13:19.640919+00	/images/left-17336db0.jpg
17	The Power Play Investing in the Future of Blockchain and AI on Cardano	Video	https://youtu.be/Fdaz9h75DLE?si=xLTiXRuQMoO5zPcK	/images/Screenshot-2026-06-20-041701-f2496530.png	Cardano Foundation	\N	\N	t	2026-06-19 19:17:54.048785+00	12	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 19:17:54.048785+00	/images/Screenshot-2026-06-20-125403-39e5bfe9.png
14	TEAMZ SUMMIT 2025 | Web3 Innovation in Japan and International Collaboration	Video	https://youtu.be/TDEb7DFgi50?si=eTgzgXZdUuIyqylG	/images/Screenshot-2026-06-20-040756-6074cf83.png	Teamz	Japan is emerging as a key player in Web3 innovation. This panel explores how international collaboration, cross-border partnerships, and cultural synergy can drive growth. Join global leaders as they discuss Japan’s role in shaping the Web3 ecosystem.\n\n日本は今、独自のWeb3イノベーションを加速させる一方で、世界との連携も求められています。本パネルでは、日本のスタートアップや大企業の最新事例をもとに、海外VCやプロジェクトとの連携の可能性、規制・文化の違いを超える共創の道を議論します。グローバルパートナーシップが鍵となる新時代のWeb3戦略とは？国内外のキープレイヤーが集結し、未来のエコシステムを描き出します。\n\nWeb3 Innovation in Japan and International Collaboration: The Potential of Global Partnerships\n日本のWeb3イノベーションと国際協力：グローバルパートナーシップの可能性\n\n🔸 Hinza Asif / Founder & CEO, Blockza / Asia Web3 Alliance Japan | Web3 Salon @AWAJ_official\n🔸 Emi Yoshikawa / Former Vice President of Strategic Initiatives / Ripple @emy_wng\n🔸 Yusuke Kaga / Startup Support Division / JETRO @JETRO_jgc\n🔸 Seira Yun / Founder & CEO / Socious @SociousDAO\n🔸 Yuta Create / Japan Hub Manager / Intersect @IntersectMBO\n\nDetails of TEAMZ SUMMIT 2026 are being updated regularly on the official website.\nBe sure to check it out for the latest news and announcements!	\N	t	2026-06-19 19:08:35.426284+00	9	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-19 19:08:35.426284+00	/images/Screenshot-2026-06-20-124830-f02a8c55.png
\.


--
-- Data for Name: member_applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.member_applications (id, company_name, applicant_name, email, phone, website, country, category, description, logo_url, reason_for_joining, linkedin_url, message, founder_name, founder_photo, founder_email, status, review_notes, organization_id, is_read, created_at, updated_at) FROM stdin;
2	CertiK	Yingna Sun	yingna.sun@certik.com	\N	http://www.certik.com	\N	Corporate Member	CertiK is the largest Web3 security services provider, headquartered in New York. Based on breakthroughs in formal verification by Yale and Columbia professors, CertiK has since grown into a trusted risk management partner for global regulators, institutions, and Web3 innovative enterprises.\n\nCertiK delivers AI-powered, full-lifecycle risk management solutions integrated into clients’ system development lifecycles (SDLC). Backed by the industry’s largest Web3 security database, CertiK embeds AI across code auditing, formal verification, deployment, and real-time security monitoring, helping organizations transform reactive security into proactive governance.\n\nTo date, it has secured $600B+ across 150+ countries under SOC 2 Type II and ISO 27001 standards, and actively supports digital asset policy development across multiple jurisdictions.	\N	\N	\N	\N	\N	\N	\N	pending	\N	113	t	2026-07-08 02:24:54.453655	2026-07-28 08:17:53.53789
4	Bitcoin Japan Inc	Mark Morinaga	mark@metaplanet.jp	+81 08068685318	https://bitcoin.jp	Japan	Corporate Member	As a wholly owned strategic subsidiary of Metaplanet, our purpose is to increase the awareness of bitcoin in the Japan market and introduce new ways to spend, earn, borrow, save and invest through the bitcoin ecosystem.	/images/BTC_KAT_Stacked-496747a2.png	Reach Web3 builders, specifically working in the bitcoin space if possible, to explore partnerships, collaborations, and potential investment opportunities through our venture capital arm.	\N	Big fan of the work the TET Capital team is doing and want to support their efforts any way I can.	\N	\N	\N	approved	\N	112	t	2026-07-08 02:44:58.08439	2026-07-09 02:16:01.001
7	CertiK	joseph.hung@certik.com	joseph.hung@certik.com	+821050512294	https://www.certik.com/	US	Corporate Member	CertiK is the largest Web3 security platform combining formal verification with audits and comprehensive security solutions.	/images/Logomark_Color-011e96aa.png	By joining the Asia Web3 Alliance Japan (AWAJ), CertiK strategically positions itself at the intersection of Japanese innovation and regional Web3 expansion. As a global leader in blockchain security and compliance, CertiK aims to support Japan’s rapidly growing, regulation-aligned digital finance ecosystem by providing enterprise-grade smart contract audits, real-time on-chain monitoring, and advanced AI-native security tools. Partnering with AWAJ allows CertiK to actively collaborate with local enterprises, Web3 startups, and government-backed initiatives, ensuring that next-generation financial infrastructure is secure by design. Ultimately, this alliance enables CertiK to foster deep, cross-border trust and establish robust security standards that protect both institutional assets and mass-market users across the Asia-Pacific region.	https://www.linkedin.com/in/josephhk	\N	Ronghu Gu	/images/ronghui-2d9a3a6d.webp	ronghui.gu@certik.com	approved	\N	113	t	2026-07-08 12:21:17.665483	2026-07-09 02:16:21.462
9	Tezos	Echo Li	echo.li@tzapac.com	\N	https://tezos.com/	singapore	Corporate Member	A public blockchain company	/images/Logo_forBLACK_background-1437a8b3.png	I would like to learn more about the RWA ecosystem in Japan and looking for local tokenized asset issuers for potential distribution partners	\N	\N	\N	\N	\N	approved	\N	114	t	2026-07-09 03:48:59.179595	2026-07-09 04:08:27.685
8	Game Studio Inc.	Hirokazu Ozaki	ozaki.h@gamestudio.co.jp	+81462361624	Gahttps://www.gamestudio.co.jp	Jappan	Corporate Member	We develop and operate games for consoles, mobile devices, arcade platforms, and PC/online environments, while also creating a wide range of interactive digital content.	\N	We hope to connect with industry partners, share knowledge, and explore new collaboration opportunities.	https://www.linkedin.com/in/hirokazu-ozaki-38711738b/	\N	Kazuhiro Fujishige	\N	\N	approved	\N	116	t	2026-07-08 15:42:04.201154	2026-07-10 05:43:31.191
10	QCP Trading　Japan	Koichi Kano	kano.koichi@qcpgroup.com	8180-4592-9477	https://www.qcpgroup.com/about-us/	Japan	Corporate Member	We are the Japan entity of Singapore headquartered QCP Group, a web3/crypto native financial institution involved in market making, structured products, treasury management, and asset managed services to qualified investor clients.	/images/Full-Logo-Black-CMYK-1eae2620.png	We are in the process of setting up a Japan office, and would like to join to better understand the local regulations and market landscape.	https://www.linkedin.com/in/koichi-kano-69b71410/	\N	\N	\N	\N	approved	\N	115	t	2026-07-09 04:43:01.460149	2026-07-09 05:12:28.385
6	AID-DCC inc.	Takamitsu Baba	starryheavens1212@gmail.com	08034433261	https://www.aid-dcc.com/	Japan	Corporate Member	Toho group, degital inovation company with IPs	\N	\N	https://www.linkedin.com/in/takamitsu-baba-4a02bb312/en	\N	\N	\N	\N	approved	\N	117	t	2026-07-08 07:00:36.21134	2026-07-10 09:48:38.077
3	Keywords International Inc.	Kyuji Kawase	kkawase@keywordsstudios.com	+81345886760	https://www.keywordsstudios.com	Japan	Corporate Member	Outsourcing for Video gaming	\N	\N	https://www.linkedin.com/in/nextspace	\N	\N	\N	\N	approved	\N	118	t	2026-07-08 02:42:23.800867	2026-07-10 09:55:24.228
12	pharaoh.mission	yukio muguruma	pharaoh.mission3@gmail.com	+818035658956	\N	\N	Exclusive Member	\N	\N	Gathering information on Web3	\N	\N	\N	\N	\N	rejected	Data is not completed	\N	t	2026-07-11 07:28:20.329241	2026-07-11 15:06:13.527
13	Ginco.Inc	Naoki Ishii	naoki.ishii@ginco.co.jp	+81368688632	https://www.ginco.co.jp/en	\N	Corporate Member	Support for all companies entering the Web3\n\nGinco provides the infrastructure necessary for companies to grow sustainably in the Web3 world and co-create new businesses with its customers. Ginco's infrastructure encompasses the functions essential to the creation of Web3 businesses, providing a comprehensive developer "Web3 Develoment Company" that supports customers in a variety of industries and sectors.	/images/ginco-logo-a714098d.png	\N	\N	\N	Yuto Morikawa	\N	\N	approved	\N	131	t	2026-07-12 00:39:18.347144	2026-07-12 01:17:47.115
5	Beauty Planning International Inc.	kosei amaki	akosejp@gmail.com	+818035007114	https://beauty-kikaku.com/	\N	Corporate Member	Our company develops and markets beauty devices and cosmetics, exports products internationally, and provides startup and business support services for beauty salons and osteopathic clinics.	/images/1000030685-9f0201fc.jpg	\N	\N	\N	\N	\N	\N	rejected	industry not match	\N	t	2026-07-08 03:21:28.678748	2026-07-12 05:13:57.73
15	upay	Ruslan Fedorin	ruslan@upay.com	+971553303326	https://upay.com	United Arab Emirates	Corporate Member	Visa cards, payments	/images/IMG_9132-46e32fb6.jpeg	Connections	http://linkedin.com/in/ruslanfedorin	\N	Owen	\N	\N	approved	\N	132	t	2026-07-12 05:01:41.225262	2026-07-12 05:08:04.523
14	trustsec.xyz	Joel Lin	joel@trustsec.xyz	+6591396706	https://trustsec.xyz/	Singapore	Corporate Member	Three tiers of security engagement designed to match your protocol's needs - from one-time audits to embedded long-term partnerships.	\N	Partnership / Networking / APAC	https://www.linkedin.com/in/joel-lin7/	\N	\N	\N	\N	approved	Dear Applicant,\r\n\r\nThank you for your interest in joining **Asia Web3 Alliance Japan (AWAJ)**.\r\n\r\nAfter reviewing your membership application, we are unable to approve it at this time because your **company logo was not included** in the application.\r\n\r\nTo complete the review process, please **reply to this email and attach your company logo**. Once we receive it, we will review your application promptly. Upon approval, you will receive confirmation and will be eligible to attend our exclusive events.\r\n\r\nWe appreciate your cooperation and look forward to receiving your company logo.\r\n\r\nKind regards,\r\n\r\n**Hinza Asif**\r\nPresident\r\nAsia Web3 Alliance Japan (AWAJ)	133	t	2026-07-12 04:58:53.582871	2026-07-12 05:14:55.942
16	COOL JAPAN FUND INC	koyama yoshinari	yoshinari-koyama@cj-fund.co.jp	81364067675	https://www.cj-fund.co.jp/	\N	Exclusive Member	A government-backed fund that provides specialized support—such as through equity financing—to business operators promoting the appeal of Japan to overseas markets.	/images/IMG_0426-e2ba6c5a.jpeg	This is because Web3 is expected to contribute to the content and inbound tourism industries—sectors that the Japanese government plans to prioritize for support moving forward.	\N	\N	Kawasaki kenichi	/images/IMG_0427-dbf09cb8.jpeg	\N	approved	\N	134	t	2026-07-12 05:18:43.32061	2026-07-12 05:19:38.244
17	Iwata Godo Law Office	Nobuyuki Kaneki	nobuyuki.kaneki@iwatagodo.com	+81 3 32143218	https://www.iwatagodo.com/sp/english/	\N	Corporate Member	Law Firm (Providing Legal Service)	\N	\N	https://jp.linkedin.com/in/nobuyuki-kaneki-9b7945297	\N	\N	\N	\N	approved	\N	135	t	2026-07-12 05:21:46.228094	2026-07-12 05:28:10.327
18	TECHI247合同会社	Yasir Shaukat	yasir@techi247.com	+817031624630	https://www.techi247.com	\N	Corporate Member	TECHI247合同会社 is a Tokyo-based AI and software development company specializing in enterprise software, AI solutions, legacy system modernization, cloud technologies, and custom web and mobile application development. We help startups, SMEs, and enterprises accelerate digital transformation through scalable technology solutions and are committed to collaborating with Japan's innovation ecosystem in AI, Web3, and emerging technologies.	/images/Techi_Logo-8589188e.png	We want to join AWAJ to actively contribute to Japan's growing AI and Web3 ecosystem while building meaningful relationships with startups, founders, investors, and technology partners across Asia. As TECHI247合同会社, we believe collaboration is the key to innovation. We look forward to sharing our expertise in enterprise software, AI, and digital transformation, while supporting cross-border business opportunities and long-term partnerships between Japan and the global technology community.	https://www.linkedin.com/in/yasir-shaukat-b3380b107/	I would be happy to contribute to AWAJ as an active member and support its activities and events on a voluntary basis. As TECHI247 is newly established in Japan, working closely with the association would also help me better understand Japan’s technology and startup ecosystem, build meaningful professional relationships, and identify areas where my international business and technical experience can support AWAJ’s mission.	Yasir Shaukat	/images/WhatsApp-Image-2026-07-12-at-5.31.42-PM-c0aee284.jpeg	yasir@techi247.com	approved	\N	136	t	2026-07-12 08:40:41.007537	2026-07-12 08:44:44.509
20	ART LLC.,	乃木坂美緒	lesalon@recommend.press	+819085662922	https://recommend.press/	日本	Startup Member	Startup aims to build and scale a comprehensive marketing platform by leveraging AI and its existing experience in influencer casting.	\N	I look for an co-founder（engineer） to enforce rapid business expansion	https://www.linkedin.com/in/mionogizaka/	\N	乃木坂美緒	/images/IMG_7606-06504ee6.JPG	lesalon@recommend.press	approved	\N	138	t	2026-07-12 14:33:04.400169	2026-07-12 19:32:42.409
21	Sygna Inc.	Toshiyuki	toshiyuki.saito@sygna.io	+819071768036	https://www.sygna.io/	Japan	Corporate Member	Sygna is a Singapore base on-chain KYC solution for crypto asset exchanges who comply with Travel Rule (required by FATF Recommendation #16 "Payment Transparency")	/images/sygna-logo-dedfaca6.png	Get in touch with global crypto asset exchanges who complying with AML/CFT including Travel Rule	https://www.linkedin.com/in/toshiyuki-saito-624a1912/	Sygna was recently merged by VerifyVASP and we have successfully built up the largest network in APAC for Travel Rule solution.  \nhttps://www.verifyvasp.com/en/news/verifyvasp-cquires-sygna-consolidating-the-global-travel-rule-network/	ShihYun Chia, CEO	/images/ShihYun-Chia-0c69975e.jpg	sy@verifyvasp.com	approved	\N	137	t	2026-07-12 14:54:31.176872	2026-07-12 19:32:32.384
23	IBM Japan., Ltd	Chiyomi Kasano	chiyomi.kasano@ibm.com	+81 8059157838	https://www.ibm.com/jp-ja	\N	Corporate Member	IBM Japan is the Japanese subsidiary of the global technology company IBM. Headquartered in Tokyo, the company has played a crucial role in Japan's IT industry for decades, driving digital transformation (DX) and enterprise AI solutions. In the area of on-chain finance, IBM Japan provides comprehensive, end-to-end support to help financial institutions seamlessly connect existing legacy banking systems with diverse partners across multiple public and private blockchain networks.	\N	\N	https://www.linkedin.com/in/chiyomi-kasano-05976a50?utm_source=share_via&utm_content=profile&utm_medium=member_ios	\N	\N	\N	\N	approved	\N	140	t	2026-07-13 03:29:00.225777	2026-07-13 04:34:26.29
22	Falcon Capital Inc.	koki G. TACHINO	tachino@falconcap.co.jp	+81-80-5038-5226	https://falconcap.co.jp	\N	Corporate Member	M&A dealer and FA: Financial Adviser, especially, focus on Web3/ AI/ etc.	/images/falcon_red-a7c5038b.png	Future social business!	\N	\N	\N	\N	\N	approved	\N	139	t	2026-07-13 02:23:30.436202	2026-07-13 02:58:47.889
27	Arcas Bridge Co., Ltd.	Adrian Li	adrian@arcasbridge.com	+8107042336144	https://arcasbridge.com/	\N	Corporate Member	Bridging East and West via 10+ years of legal, technical, and startup experience.	/images/Copy-of-Arcas-Bridge-Logo-5--31d61aa1.png	\N	https://www.linkedin.com/in/adrianmcli/	\N	Adrian Li	\N	adrian@arcasbridge.com	approved	\N	142	t	2026-07-13 07:10:48.39946	2026-07-15 03:28:37.648
25	Mizuho Bank, Ltd	YASUHIRO OKAZAKI	wai3khru7@gmail.com	+819083077199	https://www.mizuhobank.co.jp	日本	Corporate Member	\N	\N	\N	https://www.linkedin.com/in/yasuhiro-okazaki	\N	\N	\N	\N	approved	\N	141	t	2026-07-13 04:26:41.584803	2026-07-13 04:41:34.939
26	Vlightup Inc	Sachio Minamoto	sachio.minamoto@vlightup.jp	+818041533320	https://trustauthy.jp/	日本	Startup Member	TRUSTAUTHY	/images/-2-4x-d48c3d94.png	\N	https://www.linkedin.com/in/sachio-minamoto921314155	\N	Sachio Minamoto	/images/Antler--689e6b75.jpeg	sachio.minamoto@vlightup.jp	pending	\N	119	f	2026-07-13 04:27:52.73221	2026-07-28 08:17:53.53789
19	QCP Trading Japan	Koichi Kano	kano.koichi@qcpgroup.com	+8180-4592-9477	https://www.qcpgroup.com/	Japan	Corporate Member	We are the Japan entity of QCP Group, a Singapore based, MAS licensed digital asset financial institution, active in market making, stable-fiat on-ramp/off-ramp, tokenization of assets, among other activities.	/images/Full-Logo-Black-CMYK-00301346.png	We have experience in Singapore and AbuDhabi with live transactions in digital assets. We would love to become a part of the japanese Web3 community, to share our experiences, to improve our skillset while also adding our own experience to the conversations.	\N	We are open to participating in PoC`s, especially on cross border projects.	\N	\N	\N	pending	\N	147	f	2026-07-12 13:52:48.376137	2026-07-28 08:17:53.53789
29	AURAM Inc.	KAZUHIRO FUKUDA	fukuda@auram.co.jp	\N	https://www.auram.co.jp/en/	Japan	Startup Member	AURAM is building a "digital ledger for movable assets": an on-chain registry that records ownership and security interests in physical assets, starting with gold bullion, without moving them out of professional vaults. Each bar is individually identified and recorded as a Gold RWA NFT (a record of ownership and collateral rights, not a token for sale), enabling vault-to-vault trading and collateralized lending under Japanese civil law, with AI supporting verification and monitoring.	/images/AURAM--ce740c29.png	Three things. First, connections with financial institutions, vault operators, and investors interested in RWA infrastructure, as we prepare our consumer service launch in 2027 and institutional pilots for gold-backed lending. Second, we would like to learn about and apply for the next cohort of the Japan Financial Infrastructure Innovation Program, which fits our domain precisely. Third, exposure to AWAJ's international network across Asia-Pacific and the Middle East, where physical gold markets and RWA regulation are developing rapidly, to prepare our future cross-border expansion.	https://www.linkedin.com/in/kazuhiro-fukuda/	We participated in the AUTON accelerator, which AWAJ kindly sponsored, and won 3rd place among 11 teams at the Demo Day on July 13, 2026. Thank you for supporting the program. Founder Kazuhiro Fukuda is a four-time entrepreneur, and AURAM has published two proofs of concept in English (physical gold trading without moving bars, and DeFi-style collateralized lending against vaulted gold), with patents filed in Japan. English materials: https://www.auram.co.jp/en/ We would be happy to introduce our work to AWAJ members anytime.	KAZUHIRO FUKUDA	/images/2026--e6d81cf0.jpg	fukuda@auram.co.jp	approved	\N	144	t	2026-07-16 10:55:35.903447	2026-07-23 09:35:25.106
32	IQ FINCON (Pvt) Limited	Asif Haider Mirza	asif@iq-cap.com	+92 308 8888657	https://www.iq-cap.com/	Pakistan	Corporate Member	IQ FINCON is a corporate finance boutique based in Karachi, Pakistan, part of IQ Group and operating since 2011. We provide transaction advisory, capital raising, M&A, valuation, and due diligence services, and we structure and license regulated financial institutions. We work with technology and fintech companies seeking growth capital, and with international investors entering the Pakistani market.	/images/IQ-FINCON-Logo-c7d6f599.png	We are joining AWAJ because Pakistan and the AWAJ network each hold something the other currently lacks, and we are positioned to sit between them.\n\nPakistan's technology sector has substantial engineering talent and a large digital-native population, but almost no domestic growth-stage capital and virtually no presence in Asian investor networks. We advise these companies on structuring, valuation, and capital raising, and the constraint we run into repeatedly is access rather than quality. AWAJ offers a route to Japanese and Asian investors, corporates, and strategic partners that does not otherwise exist for a firm based in Karachi.\n\nIn the other direction, Pakistan enacted the Virtual Assets Act in March 2026, establishing PVARA as a permanent federal licensing authority with a defined pathway from no-objection certificate to full licence, ten licence categories, and a regulatory sandbox. A market of roughly 240 million people, with one of the world's highest rates of crypto adoption and approximately USD 38 billion in annual remittance inflows, has become accessible to licensed foreign operators for the first time. That remittance corridor is a direct stablecoin and cross-border payments use case, which aligns closely with AWAJ's existing stablecoin subcommittee.\n\nDesigning and licensing regulated financial institutions is our core competence. We took a non-banking finance company from concept through incorporation, secured its licence from the Securities and Exchange Commission of Pakistan, and supported it into operations. We also structured Pakistan's first proposed specialised infrastructure financing institution, covering financial architecture, capital strategy, and regulatory framework. The PVARA licensing process draws on the same discipline, and we intend to serve as the local financial and regulatory partner for AWAJ members evaluating Pakistan.\n\nWe are joining to contribute as much as to benefit. Specifically, we would like to participate in the stablecoin and fintech or market entry subcommittees, contribute Pakistan market intelligence to the alliance's research and policy work including a regulatory briefing for members, and over time introduce prepared Pakistani technology companies to investors within the network.	https://www.linkedin.com/in/asif-haider-mirza-1017b232/	\N	Asif Haider Mirza	/images/Asif-Haider-Mirza-Image-2c29610f.jpg	asif@iq-cap.com	approved	\N	143	t	2026-07-22 10:56:21.420924	2026-07-23 09:35:18.948
28	Bulkhead (pre-incorporation)	Takeru Kajihara	takeru2123606@gmail.com	09095900403	\N	Japan	Startup Member	Bulkhead is a security and insurance layer for DeFi, developed in Japan. It combines real-time AI transaction screening (sub-100ms hold via GNN, with LLM-based re-verification) and on-chain enforced loss caps, converting previously uninsurable, correlated DeFi risks into priced, cap-limited underwriting units ("STA cells"). Rather than automating claims, Bulkhead makes correlated risk insurable — a control layer that existing insurance infrastructure can build on.	\N	I am a Japan-based solo founder developing Bulkhead, which I presented at the AUTON program (co-hosted by SMBC Nikko Securities, one of AWAJ's strategic ecosystem partners) and at a WebX 2026 side event. DeFi security and insurance require collaboration across technology, actuarial design, and regulation — exactly where AWAJ's network of financial institutions, regulators, and Web3 builders is uniquely valuable. Through AWAJ, I hope to (1) find PoC partners among protocols and financial institutions to calibrate our risk models with real data, (2) exchange insights on Japan's evolving regulatory framework for on-chain coverage products, and (3) contribute our research on making correlated DeFi risks insurable to the broader ecosystem.	\N	Full transparency: Bulkhead currently operates as a registered sole proprietorship in Japan (kaigyo-todoke filed), with incorporation in preparation. Our design documentation spans formal theory, AI implementation, actuarial simulation, legal structuring, and third-party security review. I would be glad to share materials or present Bulkhead at AWAJ events if useful to members. I will notify AWAJ to update our directory entry once incorporation or a trade name registration is completed.	Takeru Kajihara	\N	takeru2123606@gmail.com	approved	\N	145	t	2026-07-16 05:05:09.152567	2026-07-23 09:35:49.847
11	pharaoh.mission	yukio muguruma	pharaoh.mission3@gmail.com	+818035658956	\N	\N	Corporate Member	\N	\N	Gathering information on Web3	\N	\N	\N	\N	\N	pending	\N	148	t	2026-07-11 04:00:31.460751	2026-07-28 08:17:53.53789
24	Best4U	Shinsaku Kitano	kitano7@gmail.com	+819039185494	\N	\N	Exclusive Member	\N	\N	\N	\N	\N	Shinsaku Kitano	\N	\N	pending	\N	149	f	2026-07-13 03:32:31.057777	2026-07-28 08:17:53.53789
39	Lorqsdb LLC	Mtdwa Odnabe	i.guva.wa.xa7.64@gmail.com	7180635654	https://dwjvyurpnmx.com	Nwpiligqj	Corporate Member	Osigw LLC	\N	EVUgtCCkHcttecfQlhmRIRIi	https://sxfcgj.com	vQxZnTIYrCAwlUvPZQOcZ	Eyjuy Wrksz	\N	i.guva.wa.xa7.64@gmail.com	rejected	\N	155	t	2026-08-27 09:47:57.408325	2026-08-28 01:53:45.714
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.members (id, company_name, founder_name, website_url, logo_url, description, category, contact_email, sort_order, author_id, created_at, contact_url, designation) FROM stdin;
3	Aether Protocol	Mei Lin	https://example.com	\N	On-chain identity and reputation primitives for the open web.	startup	\N	2	i5wFV5UR4ZmJ8yxpWeN32v6TPa8wvGsV	2026-06-14 19:22:35.444006	\N	\N
16	MEC Labo株式会社	吉目木 淳司／代表取締役	https://www.linkedin.com/company/mec%E2%80%91labo/	\N	Web2／Web3ゲームの開発やデザインリソース制作、AIアニメーション制作などを手掛けています。	startup	atsushi.yoshimeki@meclabo.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:30:33.268529	https://www.linkedin.com/company/mec%E2%80%91labo/	吉目木 淳司／代表取締役
17	Vlightup Inc	皆本祥男	https://www.linkedin.com/company/trustauthy/posts/?feedView=all	\N	2022年7月創業。	startup	sachio.minamoto@vlightup.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:34:05.611687	https://www.linkedin.com/company/trustauthy/posts/?feedView=all	CEO
1	Nexus Capital	Aiko Tanaka	https://example.com	\N	A venture firm backing early-stage Web3 and AI founders across Asia.	corporate	hello@example.com	1	i5wFV5UR4ZmJ8yxpWeN32v6TPa8wvGsV	2026-06-14 19:22:35.444006	https://example.com/contact	Managing Partner
18	株式会社WAVEE	早川 裕太	https://x.com/wavee_world	/images/wavee_logo_outlined_512-b2dcd984.png	Web3時代の仕事マッチングプラットフォーム「WAVEE」を運営し、人と企業をDAO的に結びつけて最適なマッチングを実現します。	startup	yuta.hayakawa@wavee.world	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:36:13.922576	https://x.com/wavee_world	代表取締役
19	橋場株式会社	橋場一晃	\N	\N	都内を中心に百貨店や駅などへ食品、お弁当、お菓子類の納品代行を行う。	startup	k‑nakamura@hashiba‑group.co.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:37:18.871169	\N	Corporate Planning DV
20	DeltaForesight株式会社	Yusuke Jindo	https://www.linkedin.com/company/deltaforesight/	\N	DeFi型日本円ステーブルコインを発行するビジネスを展開しています。	startup	yusuke.jindo@deltaforesight.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:40:41.363075	https://www.linkedin.com/company/deltaforesight/	Founder & CEO
2	ChainForge Labs	Daniel Park	https://example.com	\N	Infrastructure tooling for decentralized applications and rollups.	startup	\N	1	i5wFV5UR4ZmJ8yxpWeN32v6TPa8wvGsV	2026-06-14 19:22:35.444006	https://example.com	\N
5	JETRO	\N	https://www.jetro.go.jp	/images/images-162ccf10.png	Japan External Trade Organization — supporting global market access.	government	\N	1	i5wFV5UR4ZmJ8yxpWeN32v6TPa8wvGsV	2026-06-14 19:22:35.444006	\N	\N
6	株式会社YOAKE entertainment	村山拓海	https://www.linkedin.com/company/yoake-entertainment-japan	\N	株式会社YOAKE entertainmentは、エンターテインメント領域において新しい挑戦を続ける企業が集まり合弁会社として設立されました。日本を代表するブロックチェーン起業家を取締役に迎え、テクノロジーを活用したグローバルなエンターテインメントプロジェクトを展開しています。	startup	takumi.murayama@yoake-entertainment.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 07:47:53.10828	https://www.linkedin.com/company/yoake-entertainment-japan	Biz Lead
7	Goen LLC	Ikuya TAKASHIMA	https://www.linkedin.com/in/chief‑goen‑b4b40b286/	\N	Establishing a trust‑first financial and identity layer that enables secure payments and interactions through verified identity and user‑controlled data.	startup	ikuya.takashima@goen.io	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-20 08:06:52.731492	https://www.linkedin.com/in/chief‑goen‑b4b40b286/	CEO
8	株式会社エンジトライブ	金田晃侑	https://www.linkedin.com/in/晃侑‑金田-739660212/	\N	システムインテグレーション事業。	startup	kanedaa@engitribe.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:09:53.455105	https://www.linkedin.com/in/晃侑‑金田-739660212/	代表取締役
9	GustoDevelopment株式会社	藍 光祐	https://www.linkedin.com/company/gustodevelopment/	/images/CqAZbeRn-5bb5c81e.jpg	DexやMemeLaunchpadといったDefi関連のシステム開発やAI関連のシステム開発を行なっています。	startup	info@gustodevelopment.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:13:25.543153	https://www.linkedin.com/company/gustodevelopment/	CEO
10	日本ブロックチェーン基盤株式会社	代表取締役	\N	\N	Japan Open Chainの運営とステーブルコイン発行。	startup	daimei.inaba@jbfd.org	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:14:44.032542	\N	President
11	TRADOM Inc.	Shin Sakane	https://tradom.jp/company/corporate%E2%80%91information	/images/logo-d4af2fc9.png	Stablecoin FX.	startup	shinsakane@tradom.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:16:54.025537	\N	Co‑CEO
12	株式会社RyobiAlgoTechCapital	小野田吉孝	\N	\N	運用額20億円のRyobi Systems Innovation Fundを運営し、FinTechや医療・教育・物流・モビリティなどの領域でAIやブロックチェーン技術を中心としたスタートアップに投資しています。	startup	hanabira.reo@ryobi‑ac.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:18:08.843866	\N	Capitalist
13	株式会社かちうむ	高野和也	\N	\N	ボランタリーカーボンクレジットをブロックチェーン技術で認証から売却まで一貫して行うビジネスを展開。	startup	kazuya.takano@kachium.co.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:20:01.897523	\N	代表取締役
14	アストロバイオロジー研究所	河合純	\N	\N	研究におけるWeb3領域を推進。	startup	j.kawai0908@gmail.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:21:31.745117	\N	Founder
15	JMVL株式会社	閏間亮	https://www.linkedin.com/company/mvlchain/posts/?feedView=all	/images/start1logo-083941a0.png	モビリティの未来を創ることをミッションに、ブロックチェーン技術を活用したRWAモビリティファイナンス事業「Musubi（むすび）」を提供。シンガポールに拠点を置くMVLグループの日本法人です。	startup	keito.ogawa@mvlchain.io	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:25:09.889289	https://www.linkedin.com/company/mvlchain/posts/?feedView=all	マーケティング・広報
21	Six Oceans Capital / EMURGO Kepple Ventures	Yosuke Yoshida	\N	\N	VC	startup	yosuke.yoshida@6oc.io	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:42:09.463259	\N	CEO
22	Global Startup Hub Inc.	Kazuyuki Masuda	\N	\N	We help overseas enterprises in fintech and Web3 enter the Japanese market.	startup	ken.masuda@globalstartuphub.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:43:13.619186	\N	Co‑Founder, COO
23	株式会社博報堂キースリー	重松俊範	https://www.linkedin.com/search/results/all/?heroEntityKey=urn%3Ali%3Aorganization%3A106007324&keywords=HAKUHODO%20KEY3&origin=ENTITY_SEARCH_HOME_HISTORY&sid=-I(	/images/logo-text-4d3fb54c.png	Hakuhodo KEY3 is the world’s only Web3-specialized marketing/BizDev agency. As the Web3-focused subsidiary of Hakuhodo, it supports Japanese companies in service and product development and helps startups with go‑to‑market strategies in Japan and Asia.	startup	takeru.nishimura@key3.co.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 05:46:41.911271	https://www.linkedin.com/search/results/all/?heroEntityKey=urn%3Ali%3Aorganization%3A106007324&keywords=HAKUHODO%20KEY3&origin=ENTITY_SEARCH_HOME_HISTORY&sid=-I(	Business Producer
24	0x Consulting Group PTE.LTD.	細金恒希	https://www.linkedin.com/company/0x‑consulting‑group/	/images/0xConsultingGroup_square_black-b9f64673.png	Web3の事業開発を総合的に支援するコンサルティング企業で、FT/NFTを活用したビジネスモデル構築やトークン発行、マーケティング戦略、コミュニティ運営、日本進出支援などを行います。	startup	k.otani@zero‑x.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:00:17.107787	https://www.linkedin.com/company/0x‑consulting‑group/	Global Partnership Specialist
25	パキラ株式会社	西牟田 勲	\N	\N	投資アドバイスやM&Aコンサルティングを提供。	startup	hikarui@ymail.ne.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:01:27.831846	\N	市川市議会議員
26	トレーダム株式会社	浦島伸一郎	\N	/images/logo-1--c5434df0.png	為替リスク管理サービス「TRADOM」を運営。	startup	urashima@tradom.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:03:10.579744	\N	代表取締役社長
28	Kuntoh, Inc.	Shinsuke Nuriya	\N	\N	投資および経営コンサルティングを提供。RWAトークンの流動化案件にも取り組んでいます。	startup	shin@kuntoh.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:07:08.69229	\N	CEO
29	+81株式会社	鈴木 貴人	\N	\N	SOLIZE Holdings株式会社の新規事業創出子会社として、社会・産業課題解決に向けた新規事業の開発と運営を行っています。	startup	koichi.ubatani@hachi‑ichi.co.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:09:07.27013	\N	スタートアップ投資部／部長
30	Vlightup株式会社	皆本祥男	https://www.linkedin.com/company/trustauthy/	\N	衛星測位信号を活用したフィジタル暗号セキュリティ基盤開発およびオンチェーン型グローバル貿易金融決済プロトコルの開発を進めています。\n	startup	sachio.minamoto@vlightup.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:11:06.648394	https://www.linkedin.com/company/trustauthy/	代表取締役
31	株式会社BANKEY	阪本善彦	https://www.linkedin.com/company/bankey‑inc/	/images/bankey-52ff0698.png	\N	startup	yoshi@bankey.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:14:23.940311	https://www.linkedin.com/company/bankey‑inc/	代表取締役
32	ネクスブリッジ株式会社	李 嘉	https://x.com/0xNexBridge	/images/nexbridge-833a19e4.png	NexBridgeは、ステーブルコインを基盤とする次世代決済・送金・精算インフラを構築する日本発のデジタル金融インフラ企業です。	startup	jack@nexbridge.xyz	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:17:06.974835	https://x.com/0xNexBridge	Director
33	株式会社Neuron X	Yusuke Hirota	https://www.linkedin.com/in/yusuke‑hirota‑204a01150?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	\N	Cross‑border marketplace for tokenized real estate and RWA native line of credit.	corporate	yusuke@laplaces.co	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:19:02.040859	https://www.linkedin.com/in/yusuke‑hirota‑204a01150?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	CEO
27	株式会社nagomi	慶長久和	\N	\N	超高齢社会の日本から「手書きSNS」を発信し、スマホやタブレットで手書きの交流を広げることで孤独の防止を目指します。	startup	keicho@jsri.co.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:06:09.374297	\N	代表取締役
34	Jupyter 株式会社 (Jupyter Inc.)	Kiichi Mitsumoto	\N	/images/Jupyter-Inc-logo-945e26f5.JPG	Through Seneca, Jupyter Inc. focuses on enabling gig‑economy workers to access their earned wages immediately.	startup	mitsumoto@jupyter.co.jp	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:20:49.102487	\N	CEO
35	TheTrueTranslate 株式会社	桂 凜堂	https://x.com/t3_corp?s=21	\N	DXとブロックチェーン技術を活用し、デジタル資産の管理・流通を支える基盤を開発。誰もが使いやすいサービスで新たな価値創出を目指す企業です。	startup	sojun@the‑true‑translate.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:23:10.590905	https://x.com/t3_corp?s=21	Director
36	株式会社CareerChain	代表取締役 坂上裕樹	https://www.linkedin.com/company/111525942/admin/dashboard/	\N	フリーランスや副業人材の「価値」を可視化するキャリアプラットフォームを運営し、NFTを活用して実績・スキルを改ざん不可能な形で証明します。	startup	yuki.sakaue@career‑chain.com	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-23 06:24:50.473393	https://www.linkedin.com/company/111525942/admin/dashboard/	代表取締役
\.


--
-- Data for Name: membership_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.membership_plans (id, name, icon, price, price_note, period_label, badge, description, features, cta_label, cta_url, footnote, accent, is_highlighted, sort_order, author_id, created_at) FROM stdin;
4	Executive Member	Crown	$35000~ $150000	per year	1 Year Membership	Premium Access	For executives and leaders who want direct access to top industry leaders, co-create programs and unlock exclusive opportunities.	["All Corporate Member benefits", "Direct access to top industry leaders", "Co-create programs & initiatives", "Curated opportunities & introductions", "Private roundtables & executive dinners", "Thought leadership opportunities", "Up to 10 team members included", "Priority support & advisory access", "AWAJ Digital Economy Forum – Gold or Title Sponsorship included with membership."]	Apply Now	/membership/apply?category=Exclusive%20Member	By invitation or application only.	navy	t	4	system	2026-06-20 04:43:16.364815+00
2	Startup Member	Rocket	Free	\N	1 Year Membership	\N	For Web3 startups building the future and looking to connect, learn and grow with the right ecosystem.	["Invitations to public events", "Startup resource access", "Pitch & showcase opportunities", "Community access", "Ecosystem updates"]	Join as Startup	/membership/apply?category=Startup%20Member	Matching services, mentorship, introductions and program support available on request (charges apply).	blue	f	2	system	2026-06-20 04:43:16.364815+00
3	Corporate Member	Building2	Free	\N	1 Year Membership	\N	For companies seeking partnerships, insights and opportunities in the Web3 ecosystem.	["Invitations to public events", "Industry reports & insights", "Brand visibility on AWAJ platform", "Community access", "Ecosystem updates"]	Join as Corporate	/membership/apply?category=Corporate%20Member	Matching services, partnership development, introductions and business support available on request (charges apply).	green	f	3	system	2026-06-20 04:43:16.364815+00
1	Supporter Member	Users	Free	\N	1 Year Membership	\N	Designed for government bodies, associations, and media partners supporting innovation and ecosystem growth.	["Access to member directory", "Invitations to public events", "Newsletter & ecosystem updates", "Community access", "Recognition on our website"]	Join as Supporter	/membership/apply?category=Sponsor	Matching services and special introductions available on request (charges apply).	gold	f	1	system	2026-06-20 04:43:16.364815+00
\.


--
-- Data for Name: news_articles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news_articles (id, title, slug, excerpt, content, category, image_url, location, published_at, author_id, created_at, external_url, source, status, is_featured, program_id, media_type, sort_order) FROM stdin;
14	Iolite Dedicates New Editorial Space for Startups and VCs in Partnership with Asia Web3 Alliance Japan	iolite-dedicates-new-editorial-space-for-startups-and-vcs-in-partnership-with-as	Asia Web3 Alliance Japan (AWAJ) and Iolite, the media division of J-CAM Inc., have launched a dedicated new content section on Iolite to showcase investors, startups, and innovation leaders driving the future of Web3, blockchain, AI, and emerging technologies. The initiative will feature exclusive interviews, founder stories, investor insights, and cross-border innovation through both Iolite Online and the Iolite Magazine print edition. By combining AWAJ's global ecosystem with Iolite's editorial expertise, the collaboration aims to strengthen Japan's innovation ecosystem while providing international startups and investors with greater visibility and credibility in the Japanese market.	<p>Asia Web3 Alliance Japan (AWAJ) and Iolite, the media division of J-CAM Inc., are pleased to announce the launch of a new dedicated content section on Iolite designed to spotlight investors, startups, and innovation leaders shaping the future of Web3, blockchain, and emerging technologies.</p><p>This new initiative aims to deliver structured interviews, founder stories, and ecosystem insights through professionally curated editorial content published on Iolite Online and in the Iolite Magazine print edition.</p><h2><a target="_blank" rel="noopener noreferrer" href="https://iolite.net/opinion/hinza-asif"><strong>Elevating Investor and Startup Voices</strong></a></h2><p>The collaboration brings together AWAJ’s strong network within the global Web3 and startup ecosystem and Iolite’s editorial expertise to create a trusted media channel for:</p><ul><li><p>Investor interviews and perspectives</p></li><li><p>Startup founder stories</p></li><li><p>Industry insights and ecosystem trends</p></li><li><p>Cross-border innovation and collaboration</p></li></ul><p>The new section will serve as a bridge between Japan and the global innovation ecosystem, helping international investors and startups gain visibility and credibility in the Japanese market.</p><h2><strong>Multi-Channel Publishing Approach</strong></h2><p>To maximize visibility and reach, the new content section will be distributed through two publishing formats:</p><p><a target="_blank" rel="noopener noreferrer" href="https://iolite.net/opinion/hinza-asif"><strong>Digital Publication</strong></a><strong><br></strong> Articles will be published on Iolite Online, enabling broad digital reach and accessibility to a global audience through the platform’s web presence.</p><p><strong>Print Magazine Publication<br></strong> Selected content will also be featured in the printed edition of Iolite Magazine, providing additional visibility and long-term credibility through professionally curated editorial placement.</p><h2><strong>Strengthening Japan’s Innovation Ecosystem</strong></h2><p>Through this collaboration, AWAJ will lead interview coordination and content preparation, while Iolite will provide editorial support and Japanese translation to ensure high-quality publication and accessibility to the Japanese audience.</p><p>This initiative reflects a shared commitment to supporting the growth of Japan’s startup ecosystem and strengthening global connections in Web3 and innovation.</p><h2><strong>Looking Ahead</strong></h2><p>The new section will begin publishing interviews and startup features in the coming months, with the first lineup of investor and startup interviews currently in preparation.</p><p><strong>About Iolite (J-CAM Inc.)<br></strong>Iolite, operated by J-CAM Inc., is one of Japan's leading media platforms covering Web3, blockchain, AI, fintech, and emerging technologies through both digital and print publications. With a <strong>print circulation of approximately 20,000 copies</strong>, distributed nationwide through bookstores, industry events, and Web3-related organizations, Iolite delivers industry news, expert insights, interviews, and feature stories to business leaders, investors, entrepreneurs, and technology professionals.<br>Link: <a target="_blank" rel="noopener noreferrer" href="https://iolite.net/">https://iolite.net/</a></p><p><br></p>	News	/images/iolite-hinza-asif-d85e3839.png	Tokyo, Japan	2026-07-09 00:00:00+00	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-09 03:51:21.803079+00	\N	\N	published	f	\N	article	0
15	Asia Web3 Alliance Japan (AWAJ) Appoints New Osaka Global Startup Expo Ambassador	asia-web3-alliance-japan-awaj-appoints-new-osaka-global-startup-expo-ambassador	Hinza Asif, President of Asia Web3 Alliance Japan (AWAJ), has been appointed as an Ambassador for Global Startup EXPO 2025. Taking place on  October 05-07, 2026, at the Main venue: Umeda Kita area, the event will bring together startups, investors, corporations, governments, and innovation leaders from around the world to accelerate global collaboration, investment, and sustainable innovation. 	<p>We are honored to announce that <strong>Hinza Asif, President of Asia Web3 Alliance Japan (AWAJ)</strong>, has been officially appointed as an <strong>Ambassador of Global Startup EXPO 2025 (GSE 2025)</strong>, to be held on <strong>October 05-07, 2026</strong>, at the <strong>Main venue: Umeda Kita area.</strong></p><p>GSE 2026 is a premier international conference convening startups, investors, global corporations, government agencies, universities, and innovation leaders from around the world. Centered on deep tech and emerging technologies, the event is dedicated to addressing the world's most pressing challenges and advancing a sustainable future.</p><p>In this ambassadorial role, <a target="_blank" rel="noopener noreferrer" href="https://global-startup-expo.com/en/ambassador/#:~:text=Asia%20Web3%20Alliance%20Japan%20%2D%20AWAJ">Hinza Asif </a>will serve as a bridge between Japan and the global startup ecosystem — supporting the entry of international startups into the Japanese market, facilitating cross-border business alliances, and unlocking new investment opportunities on the world stage.</p><p>This landmark two-day gathering will bring visionary founders, leading investors, corporate executives, and policymakers together in Osaka, offering unparalleled opportunities to forge new connections, build strategic partnerships, and accelerate global growth.</p><p><strong>Event Overview</strong></p><ul><li><p><strong>Dates:</strong> October 05–07, 2026</p></li><li><p><strong>Venue:</strong> Umeda Kita area</p></li></ul><p>🔗 <strong>Event details &amp; registration:</strong> <a target="_blank" rel="noopener noreferrer" href="https://global-startup-expo.com/">https://global-startup-expo.com/</a></p><p>Join us in Osaka — and help shape the future of global innovation, together.<br>-------------------<br>日本語版</p><p>📢 <strong>【Global Startup EXPO 2026 アンバサダー就任のお知らせ】</strong></p><p>このたび、Asia Web3 Alliance Japan(AWAJ)代表 Hinza Asif は、<strong>2026年10月5日(月)〜7日(水)</strong> の3日間、<strong>大阪・梅田うめきたエリア</strong>をメイン会場として開催される国際カンファレンス「<strong>Global Startup EXPO 2026(GSE 2026)</strong>」のアンバサダーに就任いたしましたことを、謹んでお知らせいたします。</p><p>GSE 2026は、世界各国のスタートアップ、投資家、グローバル企業、政府機関、大学、イノベーションリーダーが一堂に会する国際カンファレンスです。ディープテックをはじめとする先端技術を軸に、地球規模の課題解決と持続可能な未来の実現を目指します。</p><p><a target="_blank" rel="noopener noreferrer" href="https://global-startup-expo.com/ambassador/#:~:text=%E4%B8%80%E8%88%AC%E7%A4%BE%E5%9B%A3%E6%B3%95%E4%BA%BAAsia%20Web3%20Alliance%20Japan">Hinza Asif</a>は、アンバサダーとして日本と世界のスタートアップ・エコシステムをつなぐ架け橋となり、海外スタートアップの日本市場参入支援、国際的な事業提携の促進、そしてクロスボーダー投資機会の創出に全力で取り組んでまいります。</p><p>世界を動かす起業家、投資家、企業経営者、政策リーダーが大阪に集結する、またとない3日間です。新たな出会い、戦略的パートナーシップ、そしてグローバルな成長機会を、ぜひこの場でお掴みください。</p><p><strong>【開催概要】</strong></p><ul><li><p><strong>日程:</strong> 2026年10月5日(月)〜10月7日(水)</p></li><li><p><strong>会場:</strong> メイン会場:大阪・梅田うめきたエリア</p></li></ul><p>🔗 <strong>イベント詳細・参加登録はこちら:</strong> <a target="_blank" rel="noopener noreferrer" href="https://global-startup-expo.com/">https://global-startup-expo.com/</a></p><p>大阪から、世界のイノベーションの未来を共に切り拓きましょう。</p>	News	/images/osaka-startup-expo-31cb3ad1.png	Osaka Japan	2026-07-10 00:00:00+00	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-10 04:25:09.805029+00	\N	\N	published	f	\N	article	0
\.


--
-- Data for Name: news_organizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news_organizations (id, news_id, organization_id, role_at_news, sort_order, created_at) FROM stdin;
2	14	32	\N	0	2026-07-09 03:53:54.220996
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.newsletter_subscribers (id, name, email, consent, source, created_at) FROM stdin;
1	\N	test-subscriber@example.com	t	newsletter-popup	2026-06-23 06:00:34.594383
2	Yasir Shaukat	yasir@techi247.com	t	newsletter-popup	2026-06-30 09:22:41.357138
3	Jason Beale	jason.beale@audd.digital	t	newsletter-popup	2026-07-13 05:05:15.662331
4	Kazuhiro Fukuda	fukuda@auram.co.jp	t	newsletter-popup	2026-07-16 10:39:50.709455
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.organizations (id, name, type, logo_url, website_url, country, industry, description, status, featured, sort_order, author_id, created_at, updated_at, tags, show_on_homepage) FROM stdin;
87	Vlightup株式会社	Startup	\N	https://www.linkedin.com/company/trustauthy/	\N	\N	We are developing a "phygital" cryptographic security infrastructure that leverages satellite positioning signals, as well as an on-chain global trade finance settlement protocol.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 16:03:43.631	["Startup Member"]	t
112	Bitcoin Japan Inc	Member	/images/BTC_KAT_Stacked-496747a2.png	https://bitcoin.jp	Japan	\N	As a wholly owned strategic subsidiary of Metaplanet, our purpose is to increase the awareness of bitcoin in the Japan market and introduce new ways to spend, earn, borrow, save and invest through the bitcoin ecosystem.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-09 02:16:00.983064	2026-07-09 02:16:00.983064	["Corporate Member"]	t
113	CertiK	Member	/images/Logomark_Color-011e96aa.png	https://www.certik.com/	US	\N	CertiK is the largest Web3 security platform combining formal verification with audits and comprehensive security solutions.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-09 02:16:21.459507	2026-07-09 02:16:21.459507	["Corporate Member"]	t
114	Tezos	Member	/images/Logo_forBLACK_background-1437a8b3.png	https://tezos.com/	singapore	\N	A public blockchain company	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-09 04:08:27.623242	2026-07-09 04:08:27.623242	["Corporate Member"]	t
115	QCP Trading　Japan	Member	/images/Full-Logo-Black-CMYK-1eae2620.png	https://www.qcpgroup.com/about-us/	Japan	\N	We are the Japan entity of Singapore headquartered QCP Group, a web3/crypto native financial institution involved in market making, structured products, treasury management, and asset managed services to qualified investor clients.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-09 05:12:28.34503	2026-07-09 05:12:28.34503	["Corporate Member"]	t
132	upay	Member	/images/IMG_9132-46e32fb6.jpeg	https://upay.com	United Arab Emirates	\N	Visa cards, payments	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-12 05:08:04.458919	2026-07-12 05:08:04.458919	["Corporate Member"]	t
56	AI Agent Run	Sponsor	https://www.xrp-tokyo.io/partners/community/ai-agent-run1.png	https://aigent.run/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:53.215108	2026-07-10 08:42:30.097	["Sponsor"]	f
116	Game Studio Inc.	Member	/images/Screenshot-2026-07-10-144318-6baeca11.png	https://www.gamestudio.co.jp	Jappan	\N	We develop and operate games for consoles, mobile devices, arcade platforms, and PC/online environments, while also creating a wide range of interactive digital content.	approved	t	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-10 05:43:31.176883	2026-07-10 09:48:09.276	["Corporate Member"]	t
13	Doppler Finance	Sponsor	/images/K2TTJz61e5-2a374f05.jpg	https://doppler.finance/	\N	\N	Doppler Finance is a DeFi protocol built on the XRP Ledger XRPL. It aims to provide yield-generating opportunities for XRP holders within the XRPL ecosystem.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:34.437195	2026-07-10 10:53:57.728	["Sponsor"]	t
119	Vlightup Inc	Startup	\N	https://www.linkedin.com/company/trustauthy/posts/?feedView=all	\N	\N	2022年7月創業。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:46.862689	2026-07-11 07:10:46.862689	["Startup Member"]	t
120	株式会社WAVEE	Startup	/images/wavee_logo_outlined_512-b2dcd984.png	https://x.com/wavee_world	\N	\N	Web3時代の仕事マッチングプラットフォーム「WAVEE」を運営し、人と企業をDAO的に結びつけて最適なマッチングを実現します。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:46.948819	2026-07-11 07:10:46.948819	["Startup Member"]	t
121	JETRO	Government	/images/images-162ccf10.png	https://www.jetro.go.jp	\N	\N	Japan External Trade Organization — supporting global market access.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:46.973203	2026-07-11 07:10:46.973203	["Government Support"]	t
122	株式会社nagomi	Startup	\N	\N	\N	\N	超高齢社会の日本から「手書きSNS」を発信し、スマホやタブレットで手書きの交流を広げることで孤独の防止を目指します。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:47.062774	2026-07-11 07:10:47.062774	["Startup Member"]	t
125	Microsoft	Sponsor	\N	\N	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:47.169763	2026-07-11 07:10:47.169763	["Sponsor"]	t
126	AWS	Sponsor	\N	\N	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:47.184355	2026-07-11 07:10:47.184355	["Sponsor"]	t
127	Embassy of Pakistan, Tokyo	Sponsor	\N	https://mofa.gov.pk/tokyo	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:47.219302	2026-07-11 07:10:47.219302	["Sponsor"]	t
129	jupyter.org	Sponsor	https://www.xrp-tokyo.io/partners/community/jupyter_logo_100kb.jpg	https://www.jupyter.co.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:47.435658	2026-07-11 07:10:47.435658	["Sponsor"]	t
130	partner	Partner	\N	\N	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:47.498183	2026-07-11 07:10:47.498183	["Event Partner"]	t
131	Ginco.Inc	Member	/images/ginco-logo-a714098d.png	https://www.ginco.co.jp/en	\N	\N	Support for all companies entering the Web3\n\nGinco provides the infrastructure necessary for companies to grow sustainably in the Web3 world and co-create new businesses with its customers. Ginco's infrastructure encompasses the functions essential to the creation of Web3 businesses, providing a comprehensive developer "Web3 Develoment Company" that supports customers in a variety of industries and sectors.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-12 01:17:47.090819	2026-07-12 01:17:47.090819	["Corporate Member"]	t
135	Iwata Godo Law Office	Member	/images/Screenshot-2026-07-12-142806-2d140101.png	https://www.iwatagodo.com/sp/english/	\N	\N	Law Firm (Providing Legal Service)	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-12 05:28:10.324848	2026-07-12 05:28:43.965	["Corporate Member"]	t
136	TECHI247合同会社	Member	/images/Techi_Logo-8589188e.png	https://www.techi247.com	\N	\N	TECHI247合同会社 is a Tokyo-based AI and software development company specializing in enterprise software, AI solutions, legacy system modernization, cloud technologies, and custom web and mobile application development. We help startups, SMEs, and enterprises accelerate digital transformation through scalable technology solutions and are committed to collaborating with Japan's innovation ecosystem in AI, Web3, and emerging technologies.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-12 08:44:44.492149	2026-07-12 08:44:44.492149	["Corporate Member"]	t
137	Sygna Inc.	Member	/images/sygna-logo-dedfaca6.png	https://www.sygna.io/	Japan	\N	Sygna is a Singapore base on-chain KYC solution for crypto asset exchanges who comply with Travel Rule (required by FATF Recommendation #16 "Payment Transparency")	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-12 19:32:32.367228	2026-07-12 19:32:32.367228	["Corporate Member"]	t
139	Falcon Capital Inc.	Member	/images/falcon_red-a7c5038b.png	https://falconcap.co.jp	\N	\N	M&A dealer and FA: Financial Adviser, especially, focus on Web3/ AI/ etc.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-13 02:58:47.870149	2026-07-13 02:58:47.870149	["Corporate Member"]	t
70	+81株式会社	Startup	/images/Screenshot-2026-07-08-010108-42f8d932.png	\N	\N	\N	As a subsidiary of SOLIZE Holdings Corporation dedicated to new business creation, we develop and operate new businesses aimed at solving societal and industrial challenges.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-10 08:42:26.731	["Startup Member"]	f
71	0x Consulting Group PTE.LTD.	Startup	/images/0xConsultingGroup_square_black-b9f64673.png	https://www.linkedin.com/company/0x‑consulting‑group/	Japan	\N	Web3の事業開発を総合的に支援するコンサルティング企業で、FT/NFTを活用したビジネスモデル構築やトークン発行、マーケティング戦略、コミュニティ運営、日本進出支援などを行います。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-10 08:42:28.351	["Corporate Member", "Event Partner"]	f
74	DeltaForesight株式会社	Startup	\N	https://www.linkedin.com/company/deltaforesight/	\N	\N	DeFi型日本円ステーブルコインを発行するビジネスを展開しています。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-10 08:42:44.072	["Startup Member"]	f
42	Wave of Innovation	Sponsor	https://www.xrp-tokyo.io/partners/community/wave-of-innovation.png	https://www.waveofinnovation.com/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:47.105089	2026-07-10 08:43:55.926	["Sponsor"]	f
141	Mizuho Bank, Ltd	Member	/images/img_site-logo_01-a894873b.png	https://www.mizuhobank.co.jp	日本	\N	登録金融機関 関東財務局長（登金）　第6号　加入協会：日本証券業協会 一般社団法人金融先物取引業協会　一般社団法人第二種金融商品取引業協会\n信託契約代理業　登録番号　関東財務局長（代信）第58号　所属信託会社：みずほ信託銀行株式会社	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-13 04:41:34.936566	2026-07-14 17:56:05.911	["Corporate Member"]	t
75	Global Startup Hub Inc.	Startup	/images/1700438412391-11e9b83f.jpg	https://jp.linkedin.com/company/global-startup-hub-japan	Japan	\N	“Comprehensive Gateway to Japan”. Our mission is to assist global innovative tech companies building beachheads in the Japanese market and exploring collaboration with local entities. 	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-10 11:01:58.885	["Startup Member"]	t
11	FINOLAB	Sponsor	/images/images-1e9d0cea.png	https://finolab.tokyo/	Japan	\N	Based on FinTech, we aim to produce best-in-class financial innovation at the heart\nof Japan’s financial center through co-creation across various industries.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 03:15:10.433814	2026-07-10 11:02:19.576	["Sponsor"]	f
133	trustsec.xyz	Member	/images/image-7f8ea487.png	https://trustsec.xyz/	Singapore	\N	Three tiers of security engagement designed to match your protocol's needs - from one-time audits to embedded long-term partnerships.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-12 05:14:55.914995	2026-07-12 05:15:22.003	["Corporate Member"]	t
134	COOL JAPAN FUND INC	Member	/images/IMG_0426-e2ba6c5a.jpeg	https://www.cj-fund.co.jp/	\N	\N	A government-backed fund that provides specialized support—such as through equity financing—to business operators promoting the appeal of Japan to overseas markets.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-12 05:19:38.242293	2026-07-12 05:19:38.242293	["Exclusive Member"]	t
138	ART LLC.,	Startup	\N	https://recommend.press/	日本	\N	Startup aims to build and scale a comprehensive marketing platform by leveraging AI and its existing experience in influencer casting.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-12 19:32:42.406829	2026-07-12 19:32:42.406829	["Startup Member"]	t
123	SMBC Nikko	Sponsor	/images/unnamed-8285e296.png	https://www.smbcnikko.co.jp	JAPAN	\N	SMBC Nikko Securities will provide clients with integrated financial services and high value-added solutions that meet the many and varied needs of our clients	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:47.128721	2026-07-14 18:09:42.927	["Sponsor"]	t
144	AURAM Inc.	Startup	/images/AURAM--ce740c29.png	https://www.auram.co.jp/en/	Japan	\N	AURAM is building a "digital ledger for movable assets": an on-chain registry that records ownership and security interests in physical assets, starting with gold bullion, without moving them out of professional vaults. Each bar is individually identified and recorded as a Gold RWA NFT (a record of ownership and collateral rights, not a token for sale), enabling vault-to-vault trading and collateralized lending under Japanese civil law, with AI supporting verification and monitoring.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-23 09:35:25.103716	2026-07-23 09:35:25.103716	["Startup Member"]	t
145	Bulkhead (pre-incorporation)	Startup	\N	\N	Japan	\N	Bulkhead is a security and insurance layer for DeFi, developed in Japan. It combines real-time AI transaction screening (sub-100ms hold via GNN, with LLM-based re-verification) and on-chain enforced loss caps, converting previously uninsurable, correlated DeFi risks into priced, cap-limited underwriting units ("STA cells"). Rather than automating claims, Bulkhead makes correlated risk insurable — a control layer that existing insurance infrastructure can build on.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-23 09:35:49.84469	2026-07-23 09:35:49.84469	["Startup Member"]	t
147	QCP Trading Japan	Member	\N	\N	\N	\N	\N	pending	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:17:46.724351	2026-07-28 08:17:46.724351	[]	t
148	pharaoh.mission	Member	\N	\N	\N	\N	\N	pending	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:17:46.724351	2026-07-28 08:17:46.724351	[]	t
149	Best4U	Member	\N	\N	\N	\N	\N	pending	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:17:46.724351	2026-07-28 08:17:46.724351	[]	t
72	Aether Protocol	Startup	\N	https://example.com	\N	\N	On-chain identity and reputation primitives for the open web.	approved	f	2	i5wFV5UR4ZmJ8yxpWeN32v6TPa8wvGsV	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
73	ChainForge Labs	Startup	\N	https://example.com	\N	\N	Infrastructure tooling for decentralized applications and rollups.	approved	f	1	i5wFV5UR4ZmJ8yxpWeN32v6TPa8wvGsV	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
43	XRPL Korea	Sponsor	https://www.xrp-tokyo.io/partners/community/xkorea.png	https://xrplkorea.org/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:47.542589	2026-07-07 15:24:08.684044	["Sponsor"]	t
44	XRPL Africa	Sponsor	https://www.xrp-tokyo.io/partners/community/xrpl-africa.jpg	https://x.com/XRPL_AF	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:47.977895	2026-07-07 15:24:08.684044	["Sponsor"]	t
77	GustoDevelopment株式会社	Startup	/images/CqAZbeRn-5bb5c81e.jpg	https://www.linkedin.com/company/gustodevelopment/	\N	\N	DexやMemeLaunchpadといったDefi関連のシステム開発やAI関連のシステム開発を行なっています。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
78	JMVL株式会社	Startup	/images/start1logo-083941a0.png	https://www.linkedin.com/company/mvlchain/posts/?feedView=all	\N	\N	モビリティの未来を創ることをミッションに、ブロックチェーン技術を活用したRWAモビリティファイナンス事業「Musubi（むすび）」を提供。シンガポールに拠点を置くMVLグループの日本法人です。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
80	Kuntoh, Inc.	Startup	\N	\N	\N	\N	投資および経営コンサルティングを提供。RWAトークンの流動化案件にも取り組んでいます。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
82	Nexus Capital	Member	\N	https://example.com	\N	\N	A venture firm backing early-stage Web3 and AI founders across Asia.	approved	f	1	i5wFV5UR4ZmJ8yxpWeN32v6TPa8wvGsV	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Corporate Member"]	t
85	TRADOM Inc.	Startup	/images/logo-d4af2fc9.png	https://tradom.jp/company/corporate%E2%80%91information	\N	\N	Stablecoin FX.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
88	アストロバイオロジー研究所	Startup	\N	\N	\N	\N	研究におけるWeb3領域を推進。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
89	トレーダム株式会社	Startup	/images/logo-1--c5434df0.png	\N	\N	\N	為替リスク管理サービス「TRADOM」を運営。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
90	ネクスブリッジ株式会社	Startup	/images/nexbridge-833a19e4.png	https://x.com/0xNexBridge	\N	\N	NexBridgeは、ステーブルコインを基盤とする次世代決済・送金・精算インフラを構築する日本発のデジタル金融インフラ企業です。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
91	パキラ株式会社	Startup	\N	\N	\N	\N	投資アドバイスやM&Aコンサルティングを提供。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
93	株式会社BANKEY	Startup	/images/bankey-52ff0698.png	https://www.linkedin.com/company/bankey‑inc/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
94	株式会社CareerChain	Startup	\N	https://www.linkedin.com/company/111525942/admin/dashboard/	\N	\N	フリーランスや副業人材の「価値」を可視化するキャリアプラットフォームを運営し、NFTを活用して実績・スキルを改ざん不可能な形で証明します。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
96	株式会社Neuron X	Member	\N	https://www.linkedin.com/in/yusuke‑hirota‑204a01150?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	\N	\N	Cross‑border marketplace for tokenized real estate and RWA native line of credit.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Corporate Member"]	t
97	株式会社RyobiAlgoTechCapital	Startup	\N	\N	\N	\N	運用額20億円のRyobi Systems Innovation Fundを運営し、FinTechや医療・教育・物流・モビリティなどの領域でAIやブロックチェーン技術を中心としたスタートアップに投資しています。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
79	Jupyter 株式会社 (Jupyter Inc.)	Startup	/images/Jupyter-Inc-logo-945e26f5.JPG	\N	\N	\N	Through Seneca, Jupyter Inc. focuses on enabling gig‑economy workers to access their earned wages immediately.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-10 08:43:10.575	["Startup Member"]	f
84	TheTrueTranslate 株式会社	Startup	\N	https://x.com/t3_corp?s=21	\N	\N	DXとブロックチェーン技術を活用し、デジタル資産の管理・流通を支える基盤を開発。誰もが使いやすいサービスで新たな価値創出を目指す企業です。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-10 08:43:53.15	["Startup Member"]	f
81	MEC Labo株式会社	Startup	/images/Screenshot-2026-07-11-155403-96ec8807.png	https://meclabo.com/	\N	\N	We handle the development and design resource creation for Web2 and Web3 games, as well as AI animation production.	approved	t	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-11 06:55:26.203	["Startup Member"]	t
76	Goen LLC	Startup	/images/Screenshot-2026-07-11-160119-8a2f8332.png	https://www.goen.io/	Japan	\N	Establishing a trust‑first financial and identity layer that enables secure payments and interactions through verified identity and user‑controlled data.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-11 07:02:05.508	["Startup Member"]	t
92	日本ブロックチェーン基盤株式会社	Startup	/images/Screenshot-2026-07-11-160347-5790bd4a.png	https://www.jbfd.org/	\N	\N	Japan Blockchain Infrastructure Co., Ltd. is a joint venture established by prominent Japanese companies. It operates in alignment with Japan Open Chain—a public blockchain developed by Japanese enterprises to foster the growth of a safe and secure Web3 society—and is engaged in the development and operation of both the blockchain and its associated community.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-11 07:04:36.792	["Startup Member"]	t
99	株式会社YOAKE entertainment	Startup	/images/Screenshot-2026-07-11-160457-f973b6c2.png	https://yoake-entertainment.jp/index.html	\N	\N	YOAKE entertainment Inc. was established as a joint venture by a group of companies committed to pursuing new challenges in the entertainment sector. With a leading Japanese blockchain entrepreneur serving on its board of directors, the company develops global entertainment projects that leverage technology.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-11 07:05:41.663	["Startup Member"]	t
83	Six Oceans Capital / EMURGO Kepple Ventures	Startup	/images/EMURGO_Africa_Kepple_Joint_Venture-d79b1dc3.jpg	https://ekv.emurgo.africa/	\N	\N	Creating Innovative Tech Industries from Africa\nWe support entrepreneurs to create category-defining industries and make the world better with cutting-edge technology in and from Africa.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-14 18:14:46.398	["Startup Member"]	t
100	株式会社かちうむ	Startup	\N	\N	\N	\N	ボランタリーカーボンクレジットをブロックチェーン技術で認証から売却まで一貫して行うビジネスを展開。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
101	株式会社エンジトライブ	Startup	\N	https://www.linkedin.com/in/晃侑‑金田-739660212/	\N	\N	システムインテグレーション事業。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
102	株式会社博報堂キースリー	Startup	/images/logo-text-4d3fb54c.png	https://www.linkedin.com/search/results/all/?heroEntityKey=urn%3Ali%3Aorganization%3A106007324&keywords=HAKUHODO%20KEY3&origin=ENTITY_SEARCH_HOME_HISTORY&sid=-I(	\N	\N	Hakuhodo KEY3 is the world’s only Web3-specialized marketing/BizDev agency. As the Web3-focused subsidiary of Hakuhodo, it supports Japanese companies in service and product development and helps startups with go‑to‑market strategies in Japan and Asia.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
103	橋場株式会社	Startup	\N	\N	\N	\N	都内を中心に百貨店や駅などへ食品、お弁当、お菓子類の納品代行を行う。	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Startup Member"]	t
111	Tokyo Metropolitan Government	Partner	/images/footer-sp-logo-7b98fd03.png	\N	\N	\N	\N	approved	f	6	seed	2026-07-07 15:24:08.684044	2026-07-07 15:24:08.684044	["Event Partner"]	t
6	TIS	Sponsor	\N	\N	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 03:15:10.367559	2026-07-07 15:24:08.684044	["Sponsor"]	t
14	SBI Ripple Asia	Sponsor	https://www.xrp-tokyo.io/sponsors/gold/sbi-ripple-asia.png	https://www.sbigroup.co.jp/company/group/sbirippleasia.html	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:34.87317	2026-07-07 15:24:08.684044	["Sponsor"]	t
16	anodos	Sponsor	https://www.xrp-tokyo.io/sponsors/gold/anodos1.png	https://anodos.finance/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:35.754283	2026-07-07 15:24:08.684044	["Sponsor"]	t
18	楽天ウォレット	Sponsor	https://www.xrp-tokyo.io/sponsors/silver/rakuten-wallet.png	https://www.rakuten-wallet.co.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:36.63181	2026-07-07 15:24:08.684044	["Sponsor"]	t
20	RedotPay	Sponsor	https://www.xrp-tokyo.io/sponsors/silver/redotpay.png	https://www.redotpay.com/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:37.50284	2026-07-07 15:24:08.684044	["Sponsor"]	t
22	Xaman	Sponsor	https://www.xrp-tokyo.io/sponsors/silver/xaman2.png	https://xaman.app/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:38.370418	2026-07-07 15:24:08.684044	["Sponsor"]	t
25	Giant Gox	Sponsor	https://www.xrp-tokyo.io/sponsors/bronze/giantgox2.png	https://x.com/GiantGox	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:39.682992	2026-07-07 15:24:08.684044	["Sponsor"]	t
105	Ethereum Foundation	Partner	/images/Screenshot-2026-06-15-004204-63eaf145.png	\N	\N	\N	\N	approved	f	3	seed	2026-07-07 15:24:08.684044	2026-07-10 09:01:35.421	["Event Partner"]	f
108	JETRO · Japan External Trade Organization	Partner	/images/images-d15515c5.png	\N	\N	\N	\N	approved	f	3	seed	2026-07-07 15:24:08.684044	2026-07-10 08:42:18.352	["Event Partner"]	f
27	Daikoku	Sponsor	https://www.xrp-tokyo.io/partners/community/daikoku.png	https://x.com/daikokunet009	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:40.556162	2026-07-10 08:42:41.432	["Sponsor"]	f
23	Levtech	Sponsor	/images/levtechJP-d7e6ba9b.png	https://levtech.jp/	Japan	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:38.809392	2026-07-10 12:09:42.765	["Sponsor"]	t
3	Mizuho	Sponsor	/images/mizuho-logo-22b0e91a.png	https://www.mizuhobank.co.jp/	Japan	\N	Mizuho Bank, Ltd. is a major commercial bank under the umbrella of Mizuho Financial Group, headquartered in Otemachi, Chiyoda Ward, Tokyo. Along with MUFG Bank and Sumitomo Mitsui Banking Corporation, it is one of Japan's three major "mega-banks."	approved	t	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 03:15:10.328347	2026-07-11 06:52:53.067	["Event Partner"]	t
12	SBI Group	Sponsor	https://www.xrp-tokyo.io/sponsors/platinum/sbi-group.png	https://www.sbigroup.co.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:33.998733	2026-07-10 08:43:35.158	["Sponsor"]	f
24	XRP Cloud	Sponsor	https://www.xrp-tokyo.io/sponsors/bronze/xrp-cloud-3.png	https://xrp-cloud.xyz/en	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:39.246729	2026-07-10 08:44:02.043	["Sponsor"]	f
21	XRPCafe	Sponsor	https://www.xrp-tokyo.io/sponsors/silver/xrpcafe1.png	https://xrp.cafe	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:37.936821	2026-07-10 08:44:03.206	["Sponsor"]	f
19	yellow	Sponsor	https://www.xrp-tokyo.io/sponsors/silver/yellow.png	https://yellow.com/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:37.066948	2026-07-10 08:44:24.904	["Sponsor"]	f
110	Tokyo Innovation Base (TIB)	Partner	/images/1c93fbfbab58b30b0ff580d74aca790a-2-300x147-d43cfa99.png	\N	\N	\N	\N	approved	f	5	seed	2026-07-07 15:24:08.684044	2026-07-10 09:01:28.283	["Event Partner"]	f
104	AWS Startup Loft Tokyo	Partner	/images/AWS-Loft-logo_RGB_ALT-BLK_TOKYO-300x112-eb889e09.png	\N	\N	\N	\N	approved	f	6	seed	2026-07-07 15:24:08.684044	2026-07-10 09:01:29.462	["Event Partner"]	f
107	HIRAC FUND	Partner	/images/Screenshot-2026-06-15-004534-ed94e09e.png	\N	\N	\N	\N	approved	f	5	seed	2026-07-07 15:24:08.684044	2026-07-10 09:01:30.72	["Event Partner"]	f
109	SMBC Nikko Securities	Partner	/images/images-1--78e41df5.png	\N	\N	\N	\N	approved	f	4	seed	2026-07-07 15:24:08.684044	2026-07-10 09:01:32.551	["Event Partner"]	f
106	Financial Services Agency	Partner	/images/download-197af01d.png	\N	\N	\N	\N	approved	f	1	seed	2026-07-07 15:24:08.684044	2026-07-10 09:01:38.413	["Event Partner"]	f
26	メイフラちゃん	Sponsor	https://www.xrp-tokyo.io/sponsors/bronze/mayflower3096.jpg	https://x.com/mayflower3096	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:40.120563	2026-07-10 09:01:48.267	["Sponsor"]	f
15	BITPoint	Sponsor	/images/Screenshot-2026-07-10-183839-396ced31.png	https://www.bitpoint.co.jp/	\N	\N	【BITPOINT】Cryptocurrency Exchange for Bitcoin and Other Assets\n	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:35.309373	2026-07-10 09:40:23.216	["Sponsor"]	t
17	Datavault AI	Sponsor	/images/vault-3b0c7a36.jpg	https://datavaultsite.com/	\N	\N	Datavault AI is a pioneering technology licensing company that owns a portfolio of patented, secure platforms designed to redefine how data is managed, valued, and monetized in the modern era. 	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:36.192837	2026-07-10 10:43:22.23	["Sponsor"]	t
9	Google Cloud	Sponsor	/images/gcl-30fe1196.png	https://cloud.google.com/	\N	\N	Meet your business challenges head on with AI and cloud computing services from Google, including security, data management, and hybrid & multi-cloud.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 03:15:10.407061	2026-07-10 11:24:29.841	["Sponsor"]	t
29	CoinPost	Sponsor	https://www.xrp-tokyo.io/partners/media/coinpost.png	https://coinpost.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:41.428865	2026-07-07 15:24:08.684044	["Sponsor"]	t
31	NADA NEWS	Sponsor	https://www.xrp-tokyo.io/partners/media/nadanews.png	https://www.nadanews.com/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:42.299389	2026-07-07 15:24:08.684044	["Sponsor"]	t
32	IOLITE	Sponsor	https://www.xrp-tokyo.io/partners/media/iolite.png	https://iolite.net/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:42.735928	2026-07-07 15:24:08.684044	["Sponsor"]	t
35	ECCC	Sponsor	https://www.xrp-tokyo.io/partners/supporter/ecccc.png	https://bccc.global/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:44.042941	2026-07-07 15:24:08.684044	["Sponsor"]	t
36	JBA	Sponsor	https://www.xrp-tokyo.io/partners/supporter/jba.png	https://jba-web.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:44.482219	2026-07-07 15:24:08.684044	["Sponsor"]	t
37	東大公開講座	Sponsor	https://www.xrp-tokyo.io/partners/education/東大公開講座.png	https://www.blockchain.t.u-tokyo.ac.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:44.919657	2026-07-07 15:24:08.684044	["Sponsor"]	t
40	Web3 Salon	Sponsor	https://www.xrp-tokyo.io/partners/community/web3-salon1.png	https://web3salon.or.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:46.227994	2026-07-07 15:24:08.684044	["Sponsor"]	t
46	XRPL Malaysia	Sponsor	https://www.xrp-tokyo.io/partners/community/xrpl-malaysia.jpg	https://x.com/xrplmalaysia	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:48.855313	2026-07-07 15:24:08.684044	["Sponsor"]	t
58	Wavee	Sponsor	https://www.xrp-tokyo.io/partners/community/wavee-bg-white.png	https://wavee.world/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:54.096706	2026-07-07 15:24:08.684044	["Sponsor"]	t
61	Trust Authy	Sponsor	https://www.xrp-tokyo.io/partners/community/trust-authy.jpg	https://trustauthy.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:55.404226	2026-07-07 15:24:08.684044	["Sponsor"]	t
62	TBV	Sponsor	https://www.xrp-tokyo.io/partners/community/TBV_logo.svg	https://www.tbv.xyz/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:55.841351	2026-07-07 15:24:08.684044	["Sponsor"]	t
64	xSPECTAR	Sponsor	https://www.xrp-tokyo.io/partners/community/xspectar-logo.svg	https://www.xspectar.com/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:56.720542	2026-07-07 15:24:08.684044	["Sponsor"]	t
54	Crunk Cat collection	Sponsor	https://www.xrp-tokyo.io/partners/community/crunk_cat_collection_light.png	https://x.com/Hammmnft	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:52.341086	2026-07-10 08:42:37.443	["Sponsor"]	f
49	Found	Sponsor	https://www.xrp-tokyo.io/partners/community/Found.jpg	https://www.dotfound.co.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:50.161904	2026-07-10 08:42:50.754	["Sponsor"]	f
28	Hotei	Sponsor	https://www.xrp-tokyo.io/sponsors/bronze/hotei.png	https://x.com/5porter5	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:40.99069	2026-07-10 08:43:05.643	["Sponsor"]	f
55	OHAGI	Sponsor	https://www.xrp-tokyo.io/partners/community/ohagi.jpg	https://x.com/IKEMEN_KITA_san	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:52.778807	2026-07-10 08:43:24.893	["Sponsor"]	f
47	OP Market	Sponsor	https://www.xrp-tokyo.io/partners/community/opmarket.jpg	https://opmarket.ai/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:49.290991	2026-07-10 08:43:25.928	["Sponsor"]	f
39	OffChain Tokyo	Sponsor	https://www.xrp-tokyo.io/partners/community/offchain-tokyo.png	https://luma.com/web3tokyo	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:45.788744	2026-07-10 08:43:26.941	["Sponsor"]	f
65	Rabbitflower	Sponsor	https://www.xrp-tokyo.io/partners/community/rabbitflower.png	https://x.com/RabiHouse	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:57.16186	2026-07-10 08:43:29.288	["Sponsor"]	f
63	TAKUMI	Sponsor	https://www.xrp-tokyo.io/partners/community/chain-block-summit.png	https://chainofblockssummit.com/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:56.280862	2026-07-10 08:43:41.341	["Sponsor"]	f
34	TDC	Sponsor	https://www.xrp-tokyo.io/partners/supporter/TDCLogo-PosWhite.png	https://digitalchamber.org/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:43.6076	2026-07-10 08:43:44.57	["Sponsor"]	f
59	Terry Toto	Sponsor	https://www.xrp-tokyo.io/partners/community/terry-toto.svg	https://terrytoto.com/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:54.529998	2026-07-10 08:43:47.649	["Sponsor"]	f
57	TextRP	Sponsor	https://www.xrp-tokyo.io/partners/community/text-rp.jpg	https://textrp.io/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:53.65427	2026-07-10 08:43:48.529	["Sponsor"]	f
45	XRPL Canada	Sponsor	https://www.xrp-tokyo.io/partners/community/xrpl-canada.jpeg	https://www.xrplcanada.org/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:48.41349	2026-07-10 08:44:05.117	["Sponsor"]	f
48	YTTLINKS	Sponsor	https://www.xrp-tokyo.io/partners/community/YTTLINKS_logo_square.png	https://www.yttlinks.co.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:49.727905	2026-07-10 08:44:09.803	["Sponsor"]	f
51	ciana	Sponsor	https://www.xrp-tokyo.io/partners/community/ciana_logo_dark.png	https://x.com/coinciana	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:51.032111	2026-07-10 08:44:14.812	["Sponsor"]	f
52	collection logo	Sponsor	https://www.xrp-tokyo.io/partners/community/collection logo.png	https://x.com/pokemaru06	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:51.469453	2026-07-10 08:44:16.285	["Sponsor"]	f
30	あたらしい経済	Sponsor	https://www.xrp-tokyo.io/partners/media/neweconomy1.png	https://www.neweconomy.jp/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:41.864841	2026-07-10 08:44:26.748	["Sponsor"]	f
41	渋谷Web3大学	Sponsor	https://www.xrp-tokyo.io/partners/community/渋谷Web3大学横.jpg	https://www.shibuyaweb3univ.com/	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:46.668213	2026-07-10 09:01:40.537	["Sponsor"]	f
53	piyoneko	Sponsor	https://www.xrp-tokyo.io/partners/community/piyoko_piyoneko(D) - piyoneko.png	https://x.com/jewelrycherry	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:51.906026	2026-07-10 09:01:51.977	["Sponsor"]	f
38	AKINDO	Sponsor	/images/Screenshot-2026-07-10-183548-6687c934.png	https://akindo.io/	\N	\N	AKINDO is the world’s first and largest Buildathon platform. We help blockchain infrastructure projects grow their builder ecosystems and create killer applications through a long-term, milestone-based approach.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:45.353459	2026-07-10 09:38:19.059	["Sponsor"]	t
68	We Create 3	Sponsor	https://www.xrp-tokyo.io/partners/community/we-create-3.png	https://x.com/We_Create_3	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:58.479709	2026-07-10 08:43:58.206	["Sponsor"]	f
69	XRP Army JP	Sponsor	https://www.xrp-tokyo.io/partners/community/xrp-army-jp.jpeg	https://x.com/i/communities/2026168382178132057	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:58.921234	2026-07-10 08:44:00.966	["Sponsor"]	f
66	Yukki	Sponsor	https://www.xrp-tokyo.io/partners/community/yukki.png	https://x.com/YukilovePenguin	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:57.604326	2026-07-10 08:44:10.935	["Sponsor"]	f
67	hayai-akachan	Sponsor	https://www.xrp-tokyo.io/partners/community/hayai-akachan.png	https://x.com/hayaiakachan	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:58.042603	2026-07-10 09:01:55.628	["Sponsor"]	f
117	AID-DCC inc.	Member	/images/Screenshot-2026-07-10-184834-fee6bd1b.png	https://www.aid-dcc.com/	Japan	\N	Toho group, degital inovation company with IPs	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-10 09:48:38.074428	2026-07-10 09:49:04.239	["Corporate Member"]	t
118	Keywords International Inc.	Member	/images/Screenshot-2026-07-10-185517-df186ec5.png	https://www.keywordsstudios.com	Japan	\N	Outsourcing for Video gaming	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-10 09:55:24.226215	2026-07-10 09:55:54.819	["Corporate Member"]	t
33	HashHub	Sponsor	/images/images-0ddd0a8d.jpg	https://hashhub.tokyo/	Japan	\N	\nHashHub is an organization dedicated to pursuing—on a global scale and with a particular focus on the financial sector—both the excitement of crypto (encompassing technology, philosophy, and societal change) and its economic aspects.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:43.171	2026-07-10 11:33:04.062	["Sponsor"]	t
140	IBM Japan., Ltd	Member	/images/Add-a-heading-844c117f.png	https://www.ibm.com/jp-ja	\N	\N	IBM Japan is the Japanese subsidiary of the global technology company IBM. Headquartered in Tokyo, the company has played a crucial role in Japan's IT industry for decades, driving digital transformation (DX) and enterprise AI solutions. In the area of on-chain finance, IBM Japan provides comprehensive, end-to-end support to help financial institutions seamlessly connect existing legacy banking systems with diverse partners across multiple public and private blockchain networks.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-13 04:34:26.279622	2026-07-14 17:49:10.172	["Corporate Member"]	t
5	Nomura	Sponsor	/images/Nomura-Logo-3e1fe425.png	https://www.nomura.com/	JAPAN	\N	Nomura is a Japanese financial services group that operates globally, primarily known for its investment banking and securities services. It is the largest securities firm in Japan.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 03:15:10.354255	2026-07-14 17:58:58.688	["Sponsor"]	t
1	Ripple	Sponsor	/images/image1-4-1545cbaa.avif	https://ripple.com/	\N	\N	Ripple’s suite of solutions gives financial institutions everything they need to operate across traditional and digital assets — simply, securely, and compliantly — all with one trusted partner.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 03:15:10.295404	2026-07-14 18:02:14.75	["Sponsor"]	f
124	SBI Holdings	Sponsor	/images/SBI-Holdings-Cryptocurrency-Exchange-696x449-Edited-d12f9e13.jpg	https://www.sbigroup.co.jp/english/	\N	\N	The SBI Group has three core businesses: Financial Services, Asset Management, and Biotechnology, Healthcare & Medical Informatics Business.	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-11 07:10:47.146318	2026-07-14 18:05:31.691	["Sponsor"]	t
142	Arcas Bridge Co., Ltd.	Member	/images/Copy-of-Arcas-Bridge-Logo-5--31d61aa1.png	https://arcasbridge.com/	\N	\N	Bridging East and West via 10+ years of legal, technical, and startup experience.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-15 03:28:37.62481	2026-07-15 03:28:37.62481	["Corporate Member"]	t
143	IQ FINCON (Pvt) Limited	Member	/images/IQ-FINCON-Logo-c7d6f599.png	https://www.iq-cap.com/	Pakistan	\N	IQ FINCON is a corporate finance boutique based in Karachi, Pakistan, part of IQ Group and operating since 2011. We provide transaction advisory, capital raising, M&A, valuation, and due diligence services, and we structure and license regulated financial institutions. We work with technology and fintech companies seeking growth capital, and with international investors entering the Pakistani market.	approved	f	0	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-23 09:35:18.925604	2026-07-23 09:35:18.925604	["Corporate Member"]	t
150	Token2049	Partner	/images/Screenshot-2026-07-28-213610-0f5cc3ad.png	https://token2049.com/singapore	\N	\N	\N	approved	f	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 12:36:48.74471	2026-07-28 12:36:48.74471	["Event Partner"]	t
151	Heffiqdb LLC	Member	\N	https://igoxrsscdfy.com	Dvfsjixewv	\N	Ckdxude LLC	pending	f	0	public-application	2026-08-08 11:49:35.721246	2026-08-08 11:49:35.721246	["Corporate Member"]	t
152	Obnwloa LLC	Member	\N	https://onjjfi.com	Rwgwkhnf	\N	Iwalgv LLC	pending	f	0	public-application	2026-08-09 22:27:38.888252	2026-08-09 22:27:38.888252	["Corporate Member"]	t
153	Pydwbrc LLC	Member	\N	https://gaiogefn.com	Czgiabpdwy	\N	Mlotocpohb LLC	pending	f	0	public-application	2026-08-11 16:37:08.567714	2026-08-11 16:37:08.567714	["Corporate Member"]	t
154	Trhqnqfmxp LLC	Member	\N	https://qdmkmc.com	Oelhndrfk	\N	Ovbvuhtcpt LLC	pending	f	0	public-application	2026-08-22 04:13:51.217208	2026-08-22 04:13:51.217208	["Corporate Member"]	t
155	Lorqsdb LLC	Member	\N	https://dwjvyurpnmx.com	Nwpiligqj	\N	Osigw LLC	pending	f	0	public-application	2026-08-27 09:47:57.430089	2026-08-27 09:47:57.430089	["Corporate Member"]	t
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.partners (id, name, tier, logo_url, link_url, sort_order, author_id, created_at) FROM stdin;
7	Ripple	strategic	/images/Screenshot-2026-06-15-003842-a9876d6f.png	\N	1	seed	2026-06-14 14:21:42.419047+00
1	Financial Services Agency	institution	/images/download-197af01d.png	\N	1	seed	2026-06-14 14:21:42.419047+00
8	SBI Ripple Asia	strategic	/images/Screenshot-2026-06-15-004057-ba9fa726.png	\N	2	seed	2026-06-14 14:21:42.419047+00
10	SMBC Nikko Securities	strategic	/images/images-1--78e41df5.png	\N	4	seed	2026-06-14 14:21:42.419047+00
3	JETRO · Japan External Trade Organization	institution	/images/images-d15515c5.png	\N	3	seed	2026-06-14 14:21:42.419047+00
5	Tokyo Innovation Base (TIB)	institution	/images/1c93fbfbab58b30b0ff580d74aca790a-2-300x147-d43cfa99.png	\N	5	seed	2026-06-14 14:21:42.419047+00
11	HIRAC FUND	strategic	/images/Screenshot-2026-06-15-004534-ed94e09e.png	\N	5	seed	2026-06-14 14:21:42.419047+00
9	Ethereum Foundation	strategic	/images/Screenshot-2026-06-15-004204-63eaf145.png	\N	3	seed	2026-06-14 14:21:42.419047+00
12	AWS Startup Loft Tokyo	strategic	/images/AWS-Loft-logo_RGB_ALT-BLK_TOKYO-300x112-eb889e09.png	\N	6	seed	2026-06-14 14:21:42.419047+00
6	Tokyo Metropolitan Government	institution	/images/footer-sp-logo-7b98fd03.png	\N	6	seed	2026-06-14 14:21:42.419047+00
\.


--
-- Data for Name: people; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.people (id, full_name, profile_photo, job_title, company_name, company_logo, linkedin_url, email, country, bio, role_types, tags, featured, status, sort_order, show_on_homepage, show_company_logo, show_linkedin, show_role_badge, author_id, created_at, updated_at, organization_id) FROM stdin;
31	Tatsuya Yamada	/images/Tatsuya-Yamada-531fe5f6.png	President	Rakuten Wallet, Inc.	\N	\N	\N	\N	\N	["Speaker", "Leadership"]	[]	f	published	3	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:51:33.046342	2026-06-27 11:33:27.237	\N
73	SungMo Park	https://www.xrp-tokyo.io/speakers/SungMo Park.png	Partner, Head of APAC GTM	A16z Crypto	\N	https://www.linkedin.com/in/smp0910/	\N	\N	\N	["Ecosystem Partner", "Speaker"]	[]	f	published	7	f	f	t	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:11.829271	2026-06-27 13:18:11.829271	\N
63	Jean Zhu	/images/Jean-Zhu-019cd33e.png	Co Founder	Nexbridge	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	34	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:16:46.878782	2026-06-27 11:16:46.878782	\N
54	Yoshimasa Satoh	/images/Yoshimasa-Satoh-0db140aa.png	CFA Representative Director and CEO, Japan	Alpaca	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	39	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:54:50.42443	2026-06-27 10:54:50.42443	\N
32	SungMo Park Partner	/images/SungMo-Park-40d73466.png	Partner, Head of APAC GTM	A16z Crypto	\N	\N	\N	\N	\N	["Ecosystem Partner", "Speaker"]	[]	f	published	13	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:51:33.062034	2026-06-27 09:51:33.062034	\N
57	Noriaki Yagi	/images/Noriaki-Yagi-b589fea0.png	Editor-in-chief	Iolite Magazine	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	18	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:54:50.474324	2026-06-27 11:32:29.712	\N
10	Hinza Asif	/images/Screenshot-2026-06-11-211952-db559e03.png	Founder & Representative Director	AI & WEB3 ALLIANCE JAPAN	/images/AWAJ-ASIA-WEB3-ALLIANCE-JAPAN-logo-800-x-800-px-1--2a126a63.png	https://www.linkedin.com/in/hinza-asif/?locale=en	\N	\N	Leading the alliance's mission to connect Asia's Web3 and AI ecosystem with Japan.	["Team"]	[]	t	published	0	t	f	t	t	g0voHwKK2RX5hrPIzYM3f6s2qz1uCGrU	2026-06-20 07:22:45.068627	2026-06-23 04:00:59.553	\N
11	Sandy Carter	/images/Screenshot-2026-06-15-002305-1c44f3d4.png	Chief Operating Officer	Unstoppable Domains	\N	https://www.linkedin.com/in/sandyacarter/	\N	\N	Chief Business Officer | Adweek AI Trailblazer Power 100  | Chief AI Officer | ex-AWS, ex-IBM | Forbes Contributor | LinkedIn Top Voice	["Advisor"]	[]	f	published	76	t	f	t	t	g0voHwKK2RX5hrPIzYM3f6s2qz1uCGrU	2026-06-20 07:22:45.083302	2026-06-23 04:03:54.583	\N
53	Tatsuya Kohrogi	/images/Tatsuya-Kohrogi-bcd6335d.png	Senior Ecosystem Growth Manager	Ripple	\N	\N	\N	\N	\N	["Ecosystem Partner", "Speaker"]	[]	f	published	8	t	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:54:50.395723	2026-06-27 11:34:22.97	\N
12	Leo Mizuhara	/images/Screenshot-2026-06-15-002740-c4c79dfc.png	Founder & CEO	Hashnote	\N	https://www.linkedin.com/in/leo-mizuhara/	\N	\N	Founder and CEO of Hashnote and serves on the Advisory Board, bringing extensive expertise in digital assets, institutional finance, and blockchain innovation.	["Advisor"]	[]	f	published	77	t	f	t	t	g0voHwKK2RX5hrPIzYM3f6s2qz1uCGrU	2026-06-20 07:22:45.096763	2026-06-23 04:04:02.118	\N
66	Sebastian Valdez	/images/Sebastian-Valdez-cc270b22.png	Co-Founder	xrp.cafe	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	36	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:16:46.912464	2026-06-27 11:16:46.912464	\N
62	Ikkei Matsuda Representative Director & CEO  Digital Platformer Co., Ltd.	/images/Matsuda-Ikkei-5f7ae5b6.png	Representative Director & CEO	Digital Platformer Co., Ltd.	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	38	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:05:46.733236	2026-06-27 11:05:46.733236	\N
44	Ryo Kato	/images/Ryo-Kato-7ca55717.png	CEO	HashHub Inc	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	44	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:04:18.194362	2026-06-27 10:04:18.194362	\N
67	Kyohei Shibano	/images/Tokyo-University-e8f1a0c5.png	Project Researcher 	The University of Tokyo	\N	\N	\N	\N	\N	["Speaker", "Mentor"]	[]	f	published	73	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:16:46.924129	2026-06-27 11:32:08.965	\N
33	Cody Carbone	/images/cody-carbone1-42a77d0e.jpg	CEO	The Digital Chamber	\N	\N	\N	\N	\N	["Speaker", "Leadership", "Government"]	[]	f	published	1	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:51:33.07613	2026-06-27 11:31:37.499	\N
56	Yusuke Takezawa	/images/Yusuke-Takezawa-832834f1.jpg	Independent Advisor on Cross-Border Finance and Institutional Design	Former VP at Progmat	\N	\N	\N	\N	\N	["Advisor", "Speaker"]	[]	f	published	74	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:54:50.457494	2026-06-27 10:54:50.457494	\N
42	Mai Furukawa	/images/Mai-Furukawa1-219a9bb6.png	Director of XRPL Japan Association and Support at XRPL Labs  XRPL Japan/XRPL Labs	XRPL Japan Association	\N	\N	\N	\N	\N	["Ecosystem Partner", "Speaker"]	[]	f	published	11	t	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:04:18.168185	2026-06-27 11:34:29.957	\N
34	Takuya Sugiyama	/images/Takuy-Sugiyama-2e7d1495.jpg	Vice President	SBI Ripple Asia  SBI Holdings	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	26	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:51:33.090866	2026-06-27 11:33:22.412	\N
58	Ryo Sakai	/images/Ryo-Sakai-be88159f.png	Head of Business Development & CEO	CoinPost, WebX	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	41	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:54:50.489406	2026-06-27 10:54:50.489406	\N
43	Noritaka Okabe	/images/Noritaka-Okabe-3433fcb3.png	Founder & CEO	JPYC Inc	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	43	t	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:04:18.181035	2026-06-27 11:34:45.296	\N
64	Yusuke Hirota	/images/Yusuke-Hirota-88a29fd1.png	Founder	Laplace	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	35	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:16:46.890092	2026-06-27 11:16:46.890092	\N
55	Masa Kikuchi	/images/Masa-Kikuchi-88ae4419.png	Founder & CEO	Secured Finance	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	40	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:54:50.441215	2026-06-27 10:54:50.441215	\N
65	Eri Ishiyama	/images/Carpe-Diem-a87d3885.png	 Blockchain Advocate	\N	\N	\N	\N	\N	\N	["Speaker", "Advisor"]	[]	f	published	72	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:16:46.901411	2026-06-27 11:32:01.54	\N
74	Ikkei Matsuda	https://www.xrp-tokyo.io/speakers/Matsuda Ikkei.png	Representative Director & CEO	Digital Platformer Co., Ltd.	\N	https://www.linkedin.com/in/ikkei-matsuda-74549735/	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	31	f	f	t	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 13:18:18.803716	2026-06-27 13:18:18.803716	\N
68	Panos Mekras	/images/Anodos-Finance-40d2964e.png	Co-Founder & CEO	Anodos Labs	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	32	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:27:57.832261	2026-06-27 11:27:57.832261	\N
61	Ai Kosuke	/images/Ai-Kosuke-56750a02.png	Founder	SuzuPay	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	37	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:05:46.719566	2026-06-27 11:05:46.719566	\N
20	Mr. Zarrar Hasham Khan	/images/Screenshot-2026-06-18-221811-e0034fcc.png	SECRETARY IT & TELECOMMUNICATION	\N	/images/Screenshot-2026-06-20-110901-cf6c6225.png	\N	\N	\N	\N	["Government", "Speaker"]	[]	f	published	5	f	t	f	t	g0voHwKK2RX5hrPIzYM3f6s2qz1uCGrU	2026-06-20 07:22:45.37919	2026-06-23 04:03:21.247	\N
13	David Palmer	/images/Screenshot-2026-06-15-003101-d6108d8d.png	Chief Product Officer	PairPoint 	/images/Screenshot-2026-06-15-003101-e8fe2969.png	https://www.linkedin.com/in/david-palmer-677a421b6/	\N	\N	Chief Product Officer at PairPoint and Blockchain Lead at Vodafone Business, driving the development of enterprise blockchain solutions, digital identity infrastructure, and global Web3 innovation initiatives.	["Advisor"]	[]	f	published	78	t	f	t	t	g0voHwKK2RX5hrPIzYM3f6s2qz1uCGrU	2026-06-20 07:22:45.110031	2026-06-23 04:03:46.869	\N
22	Mr. Abdul Hameed	/images/6887070fb6cca-97949935.jpeg	Ambassador	Embassy of Pakistan, Tokyo	/images/Screenshot-2026-06-20-111550-f2dd12d2.png	\N	\N	\N	\N	["Government", "Speaker"]	[]	f	published	6	f	t	f	f	g0voHwKK2RX5hrPIzYM3f6s2qz1uCGrU	2026-06-20 07:22:45.455825	2026-06-27 09:45:44.205	\N
47	Steven Zeiler	/images/Steven-Zeiler-9b96fd86.png	Developer Evangelist	Yellow	\N	\N	\N	\N	\N	["Investor", "Speaker"]	[]	f	published	9	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:22:44.408663	2026-06-27 10:22:44.408663	\N
50	Eiji Kobayashi	/images/Eiji-Kobayashi-db294ff5.png	Director & Country Head	Securitize Japan	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	21	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:22:44.450503	2026-06-27 11:32:48.583	\N
51	Ken Kawai	/images/Ken-Kawai-8a01a895.png	Advisor Partner Lawyer	Anderson Mori & Tomotsune	\N	\N	\N	\N	\N	["Ecosystem Partner", "Advisor", "Speaker"]	[]	f	published	10	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:22:44.463864	2026-06-27 10:22:44.463864	\N
35	Tomohiko Kondo	/images/Tomohiko-Kondo-81b57812.png	CEO	SBI VC Trade Co., Ltd.	\N	\N	\N	\N	\N	["Investor", "Startup Founder", "Speaker"]	[]	f	published	12	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:58:06.338205	2026-06-27 09:58:06.338205	\N
29	Markus Infanger	/images/Markus-Infanger-a767e30d.jpg	SVP, RippleX 	Ripple	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	14	t	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:42:07.029908	2026-06-27 09:47:25.215	\N
30	Christina Chan	/images/Christina-Chan-d72be2a3.jpg	Senior Director	Ripple	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	15	t	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:42:07.054477	2026-06-27 09:47:19.573	\N
70	J. Ayo Akinyele	/images/Ayo-Akinyele-1150cb23.png	Head of Engineering	RippleX	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	16	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:27:57.856964	2026-06-27 11:31:48.641	\N
41	Meg Nakamura	/images/Meg-Nakamura-e56cfb43.png	Chief Operating Officer	Evernorth	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	25	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:58:06.421269	2026-06-27 11:33:12.92	\N
60	Sojun Katsura	/images/Sojun-Katsura-f5a722af.png	Director	Papi Code	\N	\N	\N	\N	\N	["Speaker", "Startup Founder"]	[]	f	published	48	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:05:46.706112	2026-06-27 11:32:18.289	\N
52	Seiichi Kawamura	/images/Seiichi-Kawamura-5bff6511.png	Strategic Planning Dept  Blockchain Group	Toyota Blockchain Lab	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	22	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:22:44.477826	2026-06-27 11:32:54.119	\N
36	Dave McCombs	/images/Dave-McComb-74c4843e.png	Senior Re-Writer	NHK World Japan	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	23	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:58:06.352124	2026-06-27 11:32:57.963	\N
21	​Mr. Kawasaki Hideto	/images/395bc2_99a265db246742539ad979ead8956bae-mv2-1b221be3.avif	Parliamentary Vice-Minister for Digital Affairs, Japan	\N	\N	https://www.kawasakihideto.com/	\N	\N	\N	["Government", "Speaker"]	[]	f	published	4	t	f	t	t	g0voHwKK2RX5hrPIzYM3f6s2qz1uCGrU	2026-06-20 07:22:45.416983	2026-06-23 04:02:33.417	\N
72	Alexis Sirkia	/images/Alexis-Sirkia-a2efff66.png	Executive Chairman & Founder	Yellow	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	33	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:27:57.886042	2026-06-27 11:27:57.886042	\N
46	Nathaniel T. Bradley	/images/Nathaniel-08a1c4b0.png	CEO	Datavault AI	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	42	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:09:39.906581	2026-06-27 10:09:39.906581	\N
69	Rox Park	/images/Doppler-8b7111ae.png	Head of Institutions	Doppler Finance	\N	\N	\N	\N	\N	["Speaker", "Startup Founder"]	[]	f	published	46	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:27:57.843786	2026-06-27 11:31:43.178	\N
71	Robert Kiuru	/images/Xaman-486da6ae.png	COO	Xaman	\N	\N	\N	\N	\N	["Speaker", "Startup Founder"]	[]	f	published	47	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:27:57.872225	2026-06-27 11:31:54.515	\N
59	Cyrus Cruz	/images/Cyrus-Cruz-9b131a8e.png	APAC Head  	Tenity	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	17	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 11:05:46.692367	2026-06-27 11:32:14.13	\N
45	Fumihiro Arasawa	/images/Fumihiro-Arasawa-eedca361.png	CEO, XWIN Group	XWIN Group Chair, DeFi Committee  Blockchain Collaborative Consortium	\N	\N	\N	\N	\N	["Speaker", "Mentor"]	[]	f	published	71	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:09:39.897615	2026-06-27 11:31:26.996	\N
49	Taisuke Isono	/images/Taisuke-Isono-16fc81b7.png	Head of Nikko Innovation Lab	SMBC Nikko Securities Inc	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	20	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:22:44.436076	2026-06-27 11:34:55.012	\N
39	Takafumi Shimoyama	/images/Takafumi-Shimoyama-96c36b5e.png	General Manager, Head of Business Development	SBI Ripple Asia	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	24	t	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:58:06.392841	2026-06-27 11:35:00.477	\N
37	Hirokuni Onozawa	/images/hirokuni_onozawa-7f242343.png	Executive Officer	GMO Aozora Net Bank, Ltd	\N	\N	\N	\N	\N	["Speaker", "Leadership"]	[]	f	published	2	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:58:06.365892	2026-06-27 11:33:02.447	\N
38	Seihaku Yoshida	/images/HashPort-Inc-49c3b781.png	CEO 	HashPort Inc	\N	\N	\N	\N	\N	["Startup Founder", "Speaker"]	[]	f	published	45	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:58:06.379282	2026-06-27 09:58:06.379282	\N
40	Toshinari Shinohara	/images/Toshinari-Shinohara-6532dd9d.png	Director, Future Co-Creation Lab, General Management Division 	TOBU TOP TOURS	\N	\N	\N	\N	\N	["Speaker"]	[]	f	published	75	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 09:58:06.407405	2026-06-27 09:58:06.407405	\N
48	Go Makino	/images/Go-Makino-dde20442.png	Regional Director	Fireblocks Japan	\N	\N	\N	\N	\N	["Speaker", "Ecosystem Partner"]	[]	f	published	19	f	f	f	t	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-06-27 10:22:44.422527	2026-06-27 11:32:39.415	\N
82	Owen	\N	\N	upay	/images/IMG_9132-46e32fb6.jpeg	http://linkedin.com/in/ruslanfedorin	ruslan@upay.com	United Arab Emirates	\N	["Member"]	[]	f	draft	54	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:17:59.971	132
83	Kazuhiro Fujishige	\N	\N	Game Studio Inc.	\N	https://www.linkedin.com/in/hirokazu-ozaki-38711738b/	ozaki.h@gamestudio.co.jp	Jappan	\N	["Member"]	[]	f	draft	55	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:18:07.294	116
85	Yuto Morikawa	\N	\N	Ginco.Inc	/images/ginco-logo-a714098d.png	\N	naoki.ishii@ginco.co.jp	\N	\N	["Member"]	[]	f	draft	56	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:18:20.031	131
91	Joel Lin	\N	\N	trustsec.xyz	\N	https://www.linkedin.com/in/joel-lin7/	joel@trustsec.xyz	Singapore	\N	["Member"]	[]	f	draft	62	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:19:14.047	133
98	Takamitsu Baba	\N	\N	AID-DCC inc.	\N	https://www.linkedin.com/in/takamitsu-baba-4a02bb312/en	starryheavens1212@gmail.com	Japan	\N	["Member"]	[]	f	draft	66	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:19:48.62	117
99	Kyuji Kawase	\N	\N	Keywords International Inc.	\N	https://www.linkedin.com/in/nextspace	kkawase@keywordsstudios.com	Japan	\N	["Member"]	[]	f	draft	67	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:19:56.75	118
77	Mark Morinaga	\N	\N	Bitcoin Japan Inc	/images/BTC_KAT_Stacked-496747a2.png	\N	mark@metaplanet.jp	Japan	\N	["Member"]	[]	f	draft	49	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:17:14.04	112
78	Yingna Sun	\N	\N	CertiK	\N	\N	yingna.sun@certik.com	\N	\N	["Member"]	[]	f	draft	50	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:12:43.666841	113
79	Ronghu Gu	/images/ronghui-2d9a3a6d.webp	\N	CertiK	/images/Logomark_Color-011e96aa.png	https://www.linkedin.com/in/josephhk	ronghui.gu@certik.com	US	\N	["Member"]	[]	f	draft	51	t	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:22:52.394	113
80	Echo Li	\N	\N	Tezos	/images/Logo_forBLACK_background-1437a8b3.png	\N	echo.li@tzapac.com	singapore	\N	["Member"]	[]	f	draft	52	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:17:36.23	114
81	Koichi Kano	\N	\N	QCP Trading　Japan	/images/Full-Logo-Black-CMYK-1eae2620.png	https://www.linkedin.com/in/koichi-kano-69b71410/	kano.koichi@qcpgroup.com	Japan	\N	["Member"]	[]	f	draft	53	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:17:51.221	115
102	Asif Haider Mirza	/images/Asif-Haider-Mirza-Image-2c29610f.jpg	\N	IQ FINCON (Pvt) Limited	/images/IQ-FINCON-Logo-c7d6f599.png	https://www.linkedin.com/in/asif-haider-mirza-1017b232/	asif@iq-cap.com	Pakistan	\N	["Member"]	[]	f	draft	70	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:20:54.922	143
103	Cxpbh Rpteelhmb	\N	\N	Heffiqdb LLC	\N	https://gouwsw.com	a.go.r.om.a.ru3.1@gmail.com	Dvfsjixewv	\N	["Member"]	[]	f	draft	0	f	f	t	t	public-application	2026-08-08 11:49:35.757103	2026-08-08 11:49:35.757103	151
104	Frulfhkx Ulwkkzkbp	\N	\N	Obnwloa LLC	\N	https://nomdngcqf.com	o.r.uvek.u.ce.q4.3@gmail.com	Rwgwkhnf	\N	["Member"]	[]	f	draft	0	f	f	t	t	public-application	2026-08-09 22:27:38.9024	2026-08-09 22:27:38.9024	152
105	Ifjcdg Wnyuxpcaj	\N	\N	Pydwbrc LLC	\N	https://qjoghvaun.com	cuw.i.ko.wop4.5.4@gmail.com	Czgiabpdwy	\N	["Member"]	[]	f	draft	0	f	f	t	t	public-application	2026-08-11 16:37:08.585277	2026-08-11 16:37:08.585277	153
106	Zerke Frpjd	\N	\N	Trhqnqfmxp LLC	\N	https://kknbgxxre.com	i.meko.q.a.ge.x21@gmail.com	Oelhndrfk	\N	["Member"]	[]	f	draft	0	f	f	t	t	public-application	2026-08-22 04:13:51.232259	2026-08-22 04:13:51.232259	154
107	Eyjuy Wrksz	\N	\N	Lorqsdb LLC	\N	https://sxfcgj.com	i.guva.wa.xa7.64@gmail.com	Nwpiligqj	\N	["Member"]	[]	f	draft	0	f	f	t	t	public-application	2026-08-27 09:47:57.44539	2026-08-27 09:47:57.44539	155
84	Sachio Minamoto	/images/Antler--689e6b75.jpeg	\N	Vlightup Inc	/images/-2-4x-d48c3d94.png	https://www.linkedin.com/in/sachio-minamoto921314155	sachio.minamoto@vlightup.jp	日本	\N	["Member", "Startup Founder"]	[]	f	draft	27	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:12:43.666841	119
93	乃木坂美緒	/images/IMG_7606-06504ee6.JPG	\N	ART LLC.,	\N	https://www.linkedin.com/in/mionogizaka/	lesalon@recommend.press	日本	\N	["Member", "Startup Founder"]	[]	f	draft	28	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:23:19.506	138
94	KAZUHIRO FUKUDA	/images/2026--e6d81cf0.jpg	\N	AURAM Inc.	/images/AURAM--ce740c29.png	https://www.linkedin.com/in/kazuhiro-fukuda/	fukuda@auram.co.jp	Japan	\N	["Member", "Startup Founder"]	[]	f	published	29	t	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:12:43.666841	144
95	Takeru Kajihara	\N	\N	Bulkhead (pre-incorporation)	\N	\N	takeru2123606@gmail.com	Japan	\N	["Member", "Startup Founder"]	[]	f	draft	30	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:19:38.316	145
86	Nobuyuki Kaneki	\N	\N	Iwata Godo Law Office	\N	https://jp.linkedin.com/in/nobuyuki-kaneki-9b7945297	nobuyuki.kaneki@iwatagodo.com	\N	\N	["Member"]	[]	f	draft	57	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:18:29.182	135
87	Yasir Shaukat	/images/WhatsApp-Image-2026-07-12-at-5.31.42-PM-c0aee284.jpeg	\N	TECHI247合同会社	/images/Techi_Logo-8589188e.png	https://www.linkedin.com/in/yasir-shaukat-b3380b107/	yasir@techi247.com	\N	\N	["Member"]	[]	f	draft	58	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:18:54.434	136
88	ShihYun Chia, CEO	/images/ShihYun-Chia-0c69975e.jpg	\N	Sygna Inc.	/images/sygna-logo-dedfaca6.png	https://www.linkedin.com/in/toshiyuki-saito-624a1912/	sy@verifyvasp.com	Japan	\N	["Member"]	[]	f	draft	59	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:18:38.099	137
89	koki G. TACHINO	\N	\N	Falcon Capital Inc.	/images/falcon_red-a7c5038b.png	\N	tachino@falconcap.co.jp	\N	\N	["Member"]	[]	f	draft	60	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:18:46.218	139
90	YASUHIRO OKAZAKI	\N	\N	Mizuho Bank, Ltd	\N	https://www.linkedin.com/in/yasuhiro-okazaki	wai3khru7@gmail.com	日本	\N	["Member"]	[]	f	draft	61	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:19:05.664	141
92	Kawasaki kenichi	/images/IMG_0427-dbf09cb8.jpeg	\N	COOL JAPAN FUND INC	/images/IMG_0426-e2ba6c5a.jpeg	\N	yoshinari-koyama@cj-fund.co.jp	\N	\N	["Member"]	[]	f	draft	63	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:19:22.622	134
96	yukio muguruma	\N	\N	pharaoh.mission	\N	\N	pharaoh.mission3@gmail.com	\N	\N	["Member"]	[]	f	draft	64	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:12:43.666841	148
97	Shinsaku Kitano	\N	\N	Best4U	\N	\N	kitano7@gmail.com	\N	\N	["Member"]	[]	f	draft	65	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:12:43.666841	149
100	Chiyomi Kasano	\N	\N	IBM Japan., Ltd	\N	https://www.linkedin.com/in/chiyomi-kasano-05976a50?utm_source=share_via&utm_content=profile&utm_medium=member_ios	chiyomi.kasano@ibm.com	\N	\N	["Member"]	[]	f	draft	68	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:20:05.627	140
101	Adrian Li	\N	\N	Arcas Bridge Co., Ltd.	/images/Copy-of-Arcas-Bridge-Logo-5--31d61aa1.png	https://www.linkedin.com/in/adrianmcli/	adrian@arcasbridge.com	\N	\N	["Member"]	[]	f	draft	69	f	t	t	f	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 08:18:53.450621	2026-07-28 09:20:19.062	142
\.


--
-- Data for Name: playing_with_neon; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.playing_with_neon (id, name, value) FROM stdin;
1	c4ca4238a0	0.962409
2	c81e728d9d	0.16833273
3	eccbc87e4b	0.6972671
4	a87ff679a2	0.22933683
5	e4da3b7fbb	0.5420425
6	1679091c5a	0.12824126
7	8f14e45fce	0.60315305
8	c9f0f895fb	0.44852814
9	45c48cce2e	0.13934916
10	d3d9446802	0.23214807
\.


--
-- Data for Name: program_overview; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.program_overview (id, program_id, enabled, display_position, display_order, show_status_card, status_label, status_heading, total_capacity, filled_slots, remaining_slots, capacity_mode, capacity_label, application_open_date, application_deadline, program_start_date, program_end_date, deadline_label, status_mode, manual_status, published, updated_by, published_at, created_at, updated_at) FROM stdin;
1	4	t	after-banner	0	t	Program Status	\N	\N	0	\N	manual	Remaining Slots	\N	\N	\N	\N	Application Deadline	manual	upcoming	t	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-28 18:38:36.155+00	2026-07-28 16:47:24.289686+00	2026-07-28 18:38:36.155+00
\.


--
-- Data for Name: program_overview_cta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.program_overview_cta (id, overview_id, label, style, destination_type, destination, icon_value, open_in_new_tab, visible, display_order, created_at) FROM stdin;
6	1	Apply Now	primary	external	https://vm-membership-management-system-1.vusercontent.net/programs/token2049-japan-hub-2027	\N	t	t	0	2026-07-28 18:31:20.233302+00
\.


--
-- Data for Name: program_overview_feature; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.program_overview_feature (id, overview_id, value, title, subtitle, icon_type, icon_value, icon_colour, link_url, open_in_new_tab, visible, display_order, created_at) FROM stdin;
6	1	SMBC Nikko Securities	sdsdss	\N	lucide	Rocket	\N	https://vm-membership-management-system-1.vusercontent.net/programs/token2049-japan-hub-2027	f	t	0	2026-07-28 18:31:20.197564+00
\.


--
-- Data for Name: program_overview_language; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.program_overview_language (id, overview_id, locale, visible, badge, heading, content, image_url, image_alt, image_caption, image_position, display_order, created_at, updated_at) FROM stdin;
6	1	ja	t	日本語		<p>sdsdsd</p>	\N	\N	\N	bottom	0	2026-07-28 18:31:20.162435+00	2026-07-28 18:31:20.162435+00
7	1	en	t	English		<p>xcxcxxcxc</p>	\N	\N	\N	bottom	1	2026-07-28 18:31:20.162435+00	2026-07-28 18:31:20.162435+00
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.programs (id, title, slug, excerpt, content, icon, regions, image_url, sort_order, author_id, created_at, banner_url, partners, startups, gallery, title_ja, excerpt_ja, content_ja, overview_ja, benefits_ja, eligibility_ja, banner_height, application_deadline, total_slots, remaining_slots, apply_url, brochure_url, highlights, timeline, hero_tagline_ja, hero_event_label, hero_items, benefit_cards, gallery_title) FROM stdin;
1	Web3 Salon- Initiate by JETRO	web3-salon-initiate-by-jetro	Launched in 2025 with support from the Japan External Trade Organization (JETRO), Web3 Salon VC Connect is a startup-investor platform that connects founders with venture capital firms, accelerators, corporate partners, and global innovation networks to support startup growth, investment, and international expansion.	<p>Connecting Startups, Venture Capital, and Global Opportunities</p><p><a target="_blank" rel="noopener noreferrer" href="https://web3salon.or.jp/"><strong>Web3 Salon</strong></a><strong> VC Connect</strong> is a startup-investor matching initiative launched in <strong>2025</strong> under <strong>Web3 Salon</strong>, a startup community program supported by the <strong>Japan External Trade Organization (JETRO)</strong> and ecosystem partners.</p><p>Created to strengthen Japan's startup ecosystem, Web3 Salon VC Connect brings together high-potential startups, venture capital firms, corporate investors, accelerators, and industry leaders to foster innovation, investment, and international growth opportunities.</p><h2>Mission</h2><p>The initiative was established to help startups access funding, mentorship, strategic partnerships, and global market opportunities while enabling investors to discover the next generation of innovative companies across Web3, AI, fintech, digital assets, and emerging technologies.</p><h2>Key Objectives</h2><h3>Startup Discovery &amp; Investor Access</h3><p>Identify and showcase promising startups from Japan and around the world, connecting them directly with venture capital firms, corporate venture capital teams, angel investors, and family offices.</p><h3>Accelerator &amp; Growth Opportunities</h3><p>Support startup participation in accelerator programs, mentorship initiatives, pilot projects, and business development opportunities that can accelerate growth and market adoption.</p><h3>Cross-Border Expansion</h3><p>Facilitate connections between startups and international partners, helping founders expand into new markets and access global investment networks.</p><h3>Ecosystem Collaboration</h3><p>Create a platform where founders, investors, corporations, policymakers, and ecosystem leaders can collaborate, exchange knowledge, and build long-term partnerships.</p><h2>Web3 Salon VC Connect at WebX</h2><p>As one of the flagship activities of Web3 Salon, the <strong>VC Connect Stage at WebX</strong> provides selected startups with direct exposure to leading venture capital firms, institutional investors, corporate partners, and global ecosystem leaders.</p><p>Through startup showcases, investor meetings, networking sessions, and business matching opportunities, participating companies gain valuable access to funding, partnerships, and growth opportunities.</p><h2>Building Japan's Next Generation of Global Startups</h2><p><a target="_blank" rel="noopener noreferrer" href="https://web3salon.or.jp/">Web3 Salon VC Connect</a> was created with a clear vision: to strengthen Japan's startup ecosystem by connecting founders with the capital, expertise, and networks needed to scale globally.</p><p>By fostering collaboration between startups, investors, corporations, and government-supported innovation initiatives, the program helps identify promising companies and support their journey from early-stage innovation to international growth and long-term success.</p>	Landmark	Japan • Singapore • USA • UAE	/images/VC-connect-Webx2026-mqn8xu30.png	1	seed	2026-06-14 13:28:44.279437+00	\N	[{"name": "partner"}, {"name": "Tokyo Metropolitan Government", "logoUrl": "/images/Screenshot-2026-06-15-003726-mqn8z21r.png"}]	[]	[]	\N	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	\N	[]	[]	\N	\N	[]	[]	\N
3	AWAJ Venture	awaj-venture	Hands-on venture building from idea validation to MVP, sales materials, incorporation, and fundraising launch—your venture journey starts here.	<h2>AWAJ Ventures</h2><p><strong>AWAJ Ventures</strong> is the investment and venture growth platform of the Asia Web3 Alliance Japan (AWAJ), dedicated to supporting high-potential startups across AI, Web3, fintech, digital infrastructure, and emerging technologies.</p><p>We connect founders with investors, corporate partners, government organizations, and global markets to accelerate growth and cross-border expansion throughout Japan and the APAC region.</p><h3>What We Do</h3><ul><li><p>Venture Capital &amp; Investor Introductions</p></li><li><p>Startup Acceleration &amp; Mentorship</p></li><li><p>Cross-Border Market Entry (Japan &amp; APAC)</p></li><li><p>Corporate Innovation &amp; Strategic Partnerships</p></li><li><p>Fundraising Support &amp; Investment Readiness</p></li><li><p>Business Matching &amp; Global Networking</p></li></ul><p>Our mission is to build a sustainable innovation ecosystem where startups, investors, corporations, and governments collaborate to create the next generation of global technology leaders.</p>	Rocket	Global	/images/67ae22a6-18fb-4aef-8360-979e7c8f46f3-0a77fcd9.png	3	seed	2026-06-14 13:28:44.279437+00	/images/AWAJ-venture-7baef761.png	[]	[]	[]	\N	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	\N	[]	[]	\N	\N	[]	[]	\N
2	Japan Financial Infrastructure Innovation Program	japan-financial-infrastructure-innovation-program	Accelerating Web3 startups with expert mentorship, corporate partnerships, Demo Day, awards, and funding opportunities.	The Japan Financial Infrastructure Innovation Program accelerates Web3 startups with expert mentorship, corporate partnerships, a high-profile Demo Day, awards, and funding opportunities. The program is designed to bridge promising startups with Japan's financial institutions.	Award	Tokyo, Japan	/images/AWAJ-Profile-108-Capitl-9077dc69.png	2	seed	2026-06-14 13:28:44.279437+00	/images/AWAJ-Profile-108-Capitl-72f02b10.png	[]	[]	[{"imageUrl": "/images/IMG_6436-aac179e5.jpg"}, {"imageUrl": "/images/IMG_6427-2d572078.jpg"}, {"imageUrl": "/images/IMG_6454-ac13ceb3.jpg"}]	\N	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	\N	[]	[]	\N	\N	[]	[]	\N
4	Token2049 - Japan Hub 2027	token2049-japan-hub-2027	Japan Hub by AWAJ is an exclusive business acceleration programme at TOKEN2049 Singapore, designed to help Japanese Web3, AI, and blockchain companies expand into global markets.	<p><strong>Japan Hub by AWAJ</strong> is an exclusive business acceleration programme at <strong>TOKEN2049 Singapore</strong>, designed to help Japanese Web3, AI, and blockchain companies expand into global markets.</p>	Globe	\N	/images/Japan-hub-2026-final-image-1.1-c0f27ff0.png	0	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	2026-07-28 12:36:48.709656+00	/images/Japan-hub-2026-final-image-1.1-20819156.png	[{"name": "Token2049", "linkUrl": "https://token2049.com/singapore", "logoUrl": "/images/Screenshot-2026-07-28-213610-0f5cc3ad.png"}]	[]	[{"imageUrl": "/images/DSC00848-5bf7dc22.JPG"}, {"imageUrl": "/images/DSC00805-b212320a.JPG"}, {"imageUrl": "/images/DSC00843-b4629d9b.JPG"}, {"imageUrl": "/images/DSC00816-6e662665.JPG"}]	\N	Japan Hub 2027 @ TOKEN2049 は、日本のWeb3企業が世界市場へ進出するためのゲートウェイです。投資家やVCとのビジネスマッチング、グローバルPR・メディア露出、ピッチ・ネットワーキング機会、日本パビリオンへの出展、そして海外市場進出・事業開発まで、世界トップクラスのWeb3イベントで日本企業のグローバルな成長をワンストップでサポートします。	<p><strong>Japan Hub by AWAJ</strong> は、世界最大級のWeb3カンファレンス <strong>TOKEN2049 Singapore</strong> において、日本のWeb3・AI・ブロックチェーン企業のグローバル展開を支援する特別プログラムです。</p>	\N	\N	\N	medium	20 aug	8	3	https://vm-membership-management-system-1.vusercontent.net/programs/token2049-japan-hub-2027	https://vm-membership-management-system-1.vusercontent.net/programs/token2049-japan-hub-2027	[{"icon": "sdsd", "label": "Tomohiko Kondo", "value": "444"}, {"icon": "TOKEN2049 Japan Hub展示ブース", "label": "TOKEN2049会場内のJapan Hubパビリオンに出展し、世界中の投資家・企業・来場者へ自社のプロダクトやサービスをPRできます。", "value": "7"}]	[{"date": "Now", "icon": "CalendarCheck", "label": "Application Open", "highlight": "Keynote"}, {"date": "20 Aug 2026", "icon": "AlertCircle", "label": "Application Deadline", "highlight": "yes"}, {"date": "Aug 2026", "icon": "ListChecks", "label": "Selection & Review", "highlight": ""}, {"date": "Sep 2026", "icon": "ClipboardList", "label": "Preparation", "highlight": ""}, {"date": "1 - 2 Oct 2027", "icon": "Medal", "label": "TOKEN2049 Singapore", "highlight": "active"}, {"date": "Oct-Nov 2027", "icon": "Rocket", "label": "Post-event Follow-up", "highlight": ""}]	日本の優れたプロジェクトや企業を、世界のWeb3エコシステムへつなぐハブ。	TOKEN2049\nSINGAPORE	[{"icon": "Store", "label": "展示ブース提供"}, {"icon": "Star", "label": "サイドイベント登壇"}, {"icon": "Users", "label": "代表者2名の航空券"}]	[{"icon": "Store", "title": "TOKEN2049 Japan Hub展示ブース", "description": "TOKEN2049会場内のJapan Hubパビリオンに出展し、世界中の投資家・企業・来場者へ自社のプロダクトやサービスをPRできます。"}, {"icon": "Handshake", "title": "VC・投資家とのビジネスマッチング", "description": "厳選されたVC、投資家、大手企業、Web3プロジェクトとの商談機会を提供し、資金調達や事業提携をサポートします。"}, {"icon": "Star", "title": "サイドイベント・ピッチ参加機会", "description": "Japan Hub主催イベントや公式サイドイベントで、自社を世界へアピールするピッチ・登壇の機会を提供します。"}, {"icon": "Megaphone", "title": "グローバルPR・メディア掲載", "description": "国際メディア、プレスリリース、インタビューを通じて、企業のブランド認知とグローバルな露出を強化します。"}, {"icon": "Ticket", "title": "TOKEN2049チケット2枚", "description": "代表者2名分のTOKEN2049イベントパスを提供し、カンファレンスやネットワーキングエリアへ参加できます。"}, {"icon": "Plane", "title": "代表者2名分の航空券サポート", "description": "日本からシンガポールへの渡航をサポートし、参加企業の負担を軽減します。※条件あり"}, {"icon": "Globe", "title": "海外市場進出・事業開発支援", "description": "海外企業との提携、市場開拓、事業開発を支援し、日本企業のグローバル展開を加速します。"}]	Token2049- Japan Hub 2026
\.


--
-- Data for Name: programs_organizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.programs_organizations (id, program_id, organization_id, role_at_program, sort_order, created_at) FROM stdin;
2	2	14	\N	1	2026-07-03 14:39:38.81683
3	2	3	\N	0	2026-07-11 06:52:53.378332
4	2	76	\N	0	2026-07-11 07:02:05.751941
8	1	130	\N	0	2026-07-11 07:12:13.744667
9	1	111	\N	1	2026-07-11 07:12:13.744667
10	2	1	\N	0	2026-07-14 18:02:15.172365
31	4	150	\N	0	2026-07-28 18:02:45.448863
\.


--
-- Data for Name: programs_people; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.programs_people (id, program_id, person_id, role_at_program, sort_order, created_at) FROM stdin;
6	3	10	\N	0	2026-06-27 12:36:18.10941
7	2	10	\N	0	2026-07-03 14:39:38.796767
8	2	53	\N	1	2026-07-03 14:39:38.796767
9	2	49	\N	2	2026-07-03 14:39:38.796767
10	2	73	\N	3	2026-07-03 14:39:38.796767
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId", "impersonatedBy") FROM stdin;
QJharAuucQzHznPzhoEsWToMB7ZGjK31	2026-06-21 15:14:30.435+00	SO3vOxVUn7sYNu0r4x8ts2kO1bDHF6GU	2026-06-14 15:14:30.436+00	2026-06-14 15:14:30.436+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
DZl3S6GuhAjPKtK0StCVCQdPeSlyK1gs	2026-06-21 15:39:53.143+00	FYUl6ccihTj4oWooF2mzK0pevpHoR0Ih	2026-06-14 15:39:53.144+00	2026-06-14 15:39:53.144+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
D0FTEAXnTY7F5JUDxxXURyhzRDnjBhyB	2026-06-21 16:31:18.457+00	KQ4i976XFwN14qiTyZLpsRMm9GW7tjc7	2026-06-14 16:31:18.457+00	2026-06-14 16:31:18.457+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
F7KqhgVwK5VPrtJXcyjrg2YC3FyV7Z8e	2026-06-21 16:56:54.381+00	tDp9P5G5nHIuexTAIRZxs160Iu4N3JHW	2026-06-14 16:56:54.381+00	2026-06-14 16:56:54.381+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
0Lwyq4MrkcHgc9Rngx1kgLq7OwAiqRU9	2026-06-21 18:40:07.909+00	ArvD9ZHYmjN4TuMRdkik6sgjnrtGPGbT	2026-06-14 18:40:07.909+00	2026-06-14 18:40:07.909+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
N8h0FD5IkRcYa1UJEMpVopq8S6NwTk14	2026-06-21 19:23:33.591+00	fWXrbit72xxx88WUUPCOI0mbsIMZvGAs	2026-06-14 19:23:33.592+00	2026-06-14 19:23:33.592+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
EOqenZpBNm2uSQAVIqiOtchLr8hWJrUk	2026-06-22 04:42:28.347+00	KaYPGTfYBrUByAPsZfKAEUA7uwHcHKMT	2026-06-15 04:42:28.347+00	2026-06-15 04:42:28.347+00	49.43.143.204	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
1kyWYy050A7tVopv3CuUIXkHXUOEOL57	2026-06-25 08:27:04.278+00	ivbSBDewPLSXik3zkIOyyNPC7AfEjEgl	2026-06-18 08:27:04.278+00	2026-06-18 08:27:04.278+00	104.28.254.180	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
6sGluGsdPptI4WypPj61kzc07hw2zc4m	2026-06-25 11:48:15.518+00	zPzpo5rxbhmNP0hLCzIzwQWKQTrqqopI	2026-06-18 11:48:15.545+00	2026-06-18 11:48:15.545+00	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
jvMY8SLoen68mjSC1lIfp12G4lnYMudP	2026-06-25 12:11:44.612+00	tDh6rHEb4ieKDaBhrmY8JAMMfpdEUOFp	2026-06-18 12:11:44.612+00	2026-06-18 12:11:44.612+00	49.43.143.239	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
xKUJ2eOaEhv4qQHDlm7reBfEdH7VNKcT	2026-06-26 02:50:34.3+00	fNF7pyF6xTtAfDC6fX5ccWB5A8CLFLDM	2026-06-19 02:50:34.301+00	2026-06-19 02:50:34.301+00	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
5BNWxNwgtahHSiPm6m9iCYlGT0O1tKCw	2026-06-26 03:41:48.758+00	Za1f7sHCZksmgL6DxGERRmOEuC1xpIpL	2026-06-19 03:41:48.758+00	2026-06-19 03:41:48.758+00	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
cF4K9D1J9iTjRXLBHcK8KiYQumU8O6KP	2026-06-26 05:41:27.287+00	BfVrorohrFxwX5zt10WoTJJ402GL2j8A	2026-06-19 05:41:27.287+00	2026-06-19 05:41:27.287+00	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
X1ZNGb7s78ydJ4pfHeVkeNkSjVOztbvt	2026-06-26 10:46:09.341+00	ohRQuTDL4IZL5UevCpJgAuhmTesnlODQ	2026-06-15 02:46:02.867+00	2026-06-19 10:46:09.341+00	49.43.143.204	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
XiQhRSH1UltnpknzFhksEReQWSf9Hzxm	2026-06-26 11:27:34.818+00	YHLHT4gn8TQ5SfeRw3kHsVhnMI5fPfks	2026-06-19 11:27:34.819+00	2026-06-19 11:27:34.819+00	49.43.143.225	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
LwiQJg8UgEgCcQ3awKchNwPimeeaZzDr	2026-06-26 11:54:03.884+00	xiTqhd9R48zJpIBFn5Zn8IURysDOrxkr	2026-06-19 11:54:03.884+00	2026-06-19 11:54:03.884+00	49.43.143.225	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
7ui6lahE8CaxdTneOn5MGJR65plnYbgK	2026-06-26 18:09:39.549+00	croJYuk3AK6NkN7B4ozRjoSiru9Aeif5	2026-06-19 18:09:39.549+00	2026-06-19 18:09:39.549+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
oawhVlPLmHN2tFEk6A3W4ddkCCAwPVU8	2026-06-26 18:21:28.04+00	32nYJzgzPZbAgx9oyrOTLbzswEWrnLAb	2026-06-19 18:21:28.041+00	2026-06-19 18:21:28.041+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
ndiPpWj4j8mxWRcHVgigVTmRbmLoaUWl	2026-06-27 01:29:43.653+00	ivP1FWsLB921lKSq4ew4uaKMxrNIBF1m	2026-06-20 01:29:43.653+00	2026-06-20 01:29:43.653+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
H1nYjyJP2bCYcJgnG00pn5qjLYKO3XS3	2026-06-27 02:59:57.383+00	oNGd7fuS8L3dDL4PFmW4WGMAM4c0Iatt	2026-06-20 02:59:57.383+00	2026-06-20 02:59:57.383+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
Cv0WYMJcLh8khdQEcwVI0l8g3VSRhIFt	2026-06-27 04:50:34.392+00	njwu7qqreuaM8GzenxZ29OgY1HOdnljI	2026-06-20 04:50:34.392+00	2026-06-20 04:50:34.392+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
sqD6haRMXfq4KXfatIVf3hy3LYSo9kGn	2026-06-27 07:18:09.659+00	um4nbm80f1y0OJNv5Y4YRqtqSxP3X8dt	2026-06-20 07:18:09.66+00	2026-06-20 07:18:09.66+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
ppJFfelcsNjxBbWOacEjVYv2scCjSBXv	2026-06-27 15:05:32.274+00	YiJxnWhWRRCuU4djY9T5GRlMiRrgweY2	2026-06-20 15:05:32.284+00	2026-06-20 15:05:32.284+00	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
qt07udpgr5yDByvfNLGBtPiher3rb3KR	2026-06-27 16:46:47.466+00	rkWhhG6mo45Y5SX56TUDmIYTYpsc30Xv	2026-06-20 16:46:47.467+00	2026-06-20 16:46:47.467+00	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
h3m81Dw2ZtrEfg0vgyAw0smiQIEppJPC	2026-06-27 17:24:02.716+00	J73NbXBcxyp9uCOpEDHr191euVNPKaNz	2026-06-20 17:24:02.716+00	2026-06-20 17:24:02.716+00	223.187.108.85	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
8TXdKm9rtIhPWC6MOgpfy4w8i4acu4wW	2026-06-28 01:35:28.478+00	kcST2UbbJH2UII1F5So8tk1MOMFmcmve	2026-06-21 01:35:28.479+00	2026-06-21 01:35:28.479+00	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
Yy2x7rbtkQIyJSHMNY1TK1Ueu8KMJHif	2026-06-28 01:37:38.534+00	20nHxwqFDkfLKVcigMND35KZSVP7lyrZ	2026-06-21 01:37:38.535+00	2026-06-21 01:37:38.535+00	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
waEuTFOjLLsRFTMTeGmrpfL8xNvS2PcD	2026-06-28 02:15:21.628+00	53dyslxdf8T4EySbi4SUR3WHtSCHpasC	2026-06-21 02:15:21.628+00	2026-06-21 02:15:21.628+00	49.43.143.225	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
jvkluD7pk1nngnfzEzA0QlqNU8Cfd3L8	2026-06-28 03:41:27.084+00	v5PmJN303l4S8y4aiDYPBcPHrnGavMFB	2026-06-21 03:41:27.084+00	2026-06-21 03:41:27.084+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
Ta42M6J2mK5BCQYigjNpW45XFLdOgNg3	2026-06-29 03:48:15.066+00	1Cvy2QdVufmX3m6DRt7LfpukyGY887xY	2026-06-22 03:48:15.067+00	2026-06-22 03:48:15.067+00	49.43.143.225	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
IJOGQGxkhz0ioR4cYCMWSV43cInIbsPY	2026-06-29 03:49:35.727+00	9XYDxAIb96O9fc1ese6ddLnKFpRwUUwP	2026-06-20 03:44:29.637+00	2026-06-22 03:49:35.727+00	49.43.143.225	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
7zjirHmQCom7VWxO5LkYSXRPR3H9iz8g	2026-06-30 03:25:11.389+00	JRD5WOXYNy0HM9mRPU1ttkQGfJYbHVqS	2026-06-23 03:25:11.39+00	2026-06-23 03:25:11.39+00	203.215.130.93	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
uV5vGu6badPlk9cyMtH80UdlffbjvhUb	2026-06-30 04:09:58.78+00	88WxzbaKj7FAc1mlwfUHHvLbmM1xhj1t	2026-06-23 04:09:58.78+00	2026-06-23 04:09:58.78+00	49.43.143.225	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
e2Rv6qvzBWPTIxEefEH6H3omW5iafITT	2026-06-30 06:04:11.005+00	dtN3lFpU2Z1YAFpG1QTGQiGI8BmNAo5y	2026-06-23 06:04:11.005+00	2026-06-23 06:04:11.005+00	203.215.130.93	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
BDuJN7JoBfM3qvOtEDNqdzmWOh7a2Kr7	2026-06-30 09:19:47.028+00	4QvBiLxmiw7QFHnXLqfbBVHmIPMg5B74	2026-06-23 09:19:47.03+00	2026-06-23 09:19:47.03+00	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
OVxZCdPdv0QHp0Vy0d7ZWqnM0JVmgP8a	2026-07-04 03:14:06.358+00	AtdKcgnhxFwzIzDunbJYtAmjF4fIRxyS	2026-06-27 03:14:06.358+00	2026-06-27 03:14:06.358+00	223.187.98.104	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
4UgeSnISha2gFw2XWa19N8dwIjqiaEiU	2026-07-04 07:19:07.674+00	5GAcdy2gSD1j7nOWEzKv4aP4YMKcSU2v	2026-06-27 07:19:07.675+00	2026-06-27 07:19:07.675+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
tzToWdcA21cvmDXSisGBHxWLvyNzc6GX	2026-07-04 07:55:53.158+00	8m7cBO5LSYdEydz2KgwJaFa1NKYH7BWp	2026-06-27 07:55:53.159+00	2026-06-27 07:55:53.159+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
jqHwrYoBa18IYLBydfU8p67sjoB4u0xH	2026-07-04 12:30:23.075+00	Nw2IeOQ8IDp98rcr4yCmqB95RheckF3T	2026-06-27 12:30:23.075+00	2026-06-27 12:30:23.075+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
paVQgNci3XaEy6LeAkBozce7srIXbmXZ	2026-07-04 12:51:52.772+00	LAi1lJ6FTB8qtBJu61tji5fZFiqFLoGe	2026-06-27 12:51:52.772+00	2026-06-27 12:51:52.772+00	38.137.49.208	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
0EN9YgRVLxg1maqKeMjQxxynUt7ppVX2	2026-07-04 14:05:57.666+00	7sjzaadlaa6hC9132Jb5L0IsHojX8Du9	2026-06-27 14:05:57.666+00	2026-06-27 14:05:57.666+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
BEzVkvxVUqHpN5suO9Dt16Xp2rw9VQxI	2026-07-05 06:01:28.207+00	fD3DKFzKLCZnhnQRa2dJMOZ38wvykJMM	2026-06-28 06:01:28.208+00	2026-06-28 06:01:28.208+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
LCi4OS4mqsRdBreEMnJI4et5ips6JFrI	2026-07-05 06:51:02.28+00	L9COPQL5T7kPGfRdRsy6uucg1Mea4iMI	2026-06-28 06:51:02.281+00	2026-06-28 06:51:02.281+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
Qqv4K2BfApIKq3VW9Aq3zcub1VBNiIjl	2026-07-05 06:58:07.267+00	cOGSrG1SDma1ePTInt2JRAPQKqrBuIop	2026-06-27 06:38:21.668+00	2026-06-28 06:58:07.267+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
2laWKxGEog7wn4yKUn3mSyCg7HW5S2Dm	2026-07-05 11:27:29.104+00	brNGlTJxHCjDOHwit0LvWvagJ7QgCOiG	2026-06-28 11:27:29.104+00	2026-06-28 11:27:29.104+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
3MyMvViaXnDhr2YYluwtN6yjy8FKsPwf	2026-07-14 14:33:25.925+00	vUnHK00fDcF1ZEs3KSEWR1p7KX29xLbr	2026-07-07 14:33:25.925+00	2026-07-07 14:33:25.925+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
DsfWXh2mpCLko391kxnwxMixRmMMefu3	2026-07-10 11:47:02.589+00	K5LpaDCSAt5co9Ri7G846H8oRI33Ltq1	2026-07-03 11:47:02.59+00	2026-07-03 11:47:02.59+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
ZCp7vE7MMVCnvcDwuFqKxXn6cfAkO3Wq	2026-07-14 15:58:10.421+00	Lloqtuy7owliN6029WqhIgd0ZKPpeZWq	2026-07-07 15:58:10.422+00	2026-07-07 15:58:10.422+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
sAhqvW1o9CC2CXmhyiqqymlIFjRCdiv3	2026-07-20 02:56:31.798+00	rcNRno0468OyQe0agKqBT2TbABQolNz2	2026-07-08 03:23:48.825+00	2026-07-13 02:56:31.798+00	203.215.130.93	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
QE5IKqWDgn8fdwKkRmSJmR57QMiGbvKw	2026-07-17 02:05:51.062+00	Q5l0yiOnmVErhzZxtfpEyLYmtVvuhPRc	2026-07-07 14:34:38.765+00	2026-07-10 02:05:51.062+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
C1KGkNFDN6YQcPnisfChABLNMrz9Xged	2026-08-02 06:37:25.818+00	EYuwXAB2xG7v0gH8hHa481EPt6UnTNnk	2026-07-23 02:34:12.486+00	2026-07-26 06:37:25.818+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
oaFUNr2zgGWOIwM3WCXbW4HRESV68Urz	2026-07-20 14:43:45.845+00	wDYbKNYDcDuizyNtQ50BkBC9Gkcl8e0q	2026-07-08 10:00:05.579+00	2026-07-13 14:43:45.845+00	219.104.134.78	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
gaKyr7yfVsgZGHaofiql1O92DBBdWJnp	2026-07-21 17:44:23.432+00	gvCUWYUALARaE0KtcDd9hYoxARoyy0VZ	2026-07-10 08:59:43.753+00	2026-07-14 17:44:23.432+00	205.164.151.4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	4vbFW10lrYeoiizfxCDxhmyKILXa98M2	\N
51wwGfUIAsfYvAFLDhp2j8MlbFrmnbsH	2026-08-03 06:40:00.198+00	I8S676xKkPnm0pRUJjpQVvN00IAkPJqh	2026-07-27 06:40:00.199+00	2026-07-27 06:40:00.199+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
5Mv0bUTa2877yhlBZnjIIfrEpdzhxYmj	2026-07-24 13:55:01.557+00	a57NXvPbPifBEjwOJRiF7EJbhN2WJT4X	2026-07-11 06:32:08.623+00	2026-07-17 13:55:01.557+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
V9LaPYCZ8EegeIUM8yqBA9Xikj3MaIpE	2026-08-04 07:13:35.278+00	DTBrmzBVh1wPt08JdRZJ3CqcblIdUfyb	2026-07-23 09:35:08.001+00	2026-07-28 07:13:35.278+00	219.104.134.78	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
oPFx9HYUzczZDUUbRsx8t31NX0ZBiCH6	2026-07-27 03:24:32.235+00	vHgR8Pow41ijN1kkMYURXgpAPWkvnvvY	2026-07-15 03:28:07.075+00	2026-07-20 03:24:32.235+00	203.215.130.93	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
iR1aP5jxZ7mVtQhMYv7UVW9k0I9xN3xl	2026-07-29 04:35:35.78+00	3T3z4t75eWOWiqFI2ba6o9oaw7rWRmJx	2026-07-19 12:07:17.833+00	2026-07-22 04:35:35.78+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
zAs5XHTOOsAAEBK3jnr6HoeHpv1I2ywX	2026-08-04 07:58:11.073+00	Kw8YftEg4WWaIwQ4DK005nHKXk7RyHuf	2026-07-28 07:58:11.073+00	2026-07-28 07:58:11.073+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
HmQYpPc32EzPSW1g6QHvFsA92FVGmRDM	2026-07-29 12:48:51.409+00	Ag0xzwnRpuf7E5IFyBDbETc0jihHcaEV	2026-07-22 12:48:51.409+00	2026-07-22 12:48:51.409+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
tyVsZgToDHGgwI63fmZma9KMfzMM2F9H	2026-07-29 13:07:23.714+00	2P7vgFtszOE8zgl4OFBg6gQUF5gUBALQ	2026-07-22 13:07:23.714+00	2026-07-22 13:07:23.714+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
bdK11vBVkksA11TfmvkZQBWzzh1BebpF	2026-08-04 12:46:10.647+00	ZXtDRHXXdLHnTJfaPu2ASJAPPvCW2Dln	2026-07-28 12:46:10.647+00	2026-07-28 12:46:10.647+00	1.112.72.46	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
fAL6CcN8oVc9t5aP9Gub5V4GY2MDy9LY	2026-08-05 08:08:52.903+00	MStKRU7coAcb0JEk9GBPrnxhxNoYN75C	2026-07-28 07:26:02.86+00	2026-07-29 08:08:52.903+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
enRnOzCQFUr1X0usDvInWDufnX2gsKnd	2026-08-12 00:39:33.589+00	1TGm61yGQb9LUAi7V1dXWxV7BVnrmQy5	2026-08-05 00:39:33.589+00	2026-08-05 00:39:33.589+00	111.189.11.103	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
QEVLM96KMBMIpYJvMccSMSnFpCSJaaGa	2026-08-12 00:39:35.286+00	Igb1bfmYGc0SFUyS8m32j1aYTRskubrz	2026-08-05 00:39:35.286+00	2026-08-05 00:39:35.286+00	111.189.11.103	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Mobile/15E148 Safari/604.1	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
12hqzioCh0rEZZocIEhQVZDpwnIELznu	2026-08-14 17:14:17.616+00	mjwwMo3GxGtNhMXvLVI2XwOdXatNt0dv	2026-08-06 07:18:37.645+00	2026-08-07 17:14:17.616+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
3iQdlJeOF2P6tXNSWmjyYDdTDibPuYPC	2026-08-21 15:28:20.791+00	aLighd04A0alE1i7u9SeOVuDtdTfXbG0	2026-08-14 15:28:20.791+00	2026-08-14 15:28:20.791+00	219.104.134.78	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
sEoH6nGDURQ9P8uPBlcFVACZvXJLXcl1	2026-08-26 23:36:26.993+00	eaFzmNrUTZ5YpXPyeAVWPia9OZEtnSDW	2026-08-17 07:07:30.36+00	2026-08-19 23:36:26.993+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
XbZRe1mgCTNOK2UeQWNWhQ39QFuAHyn8	2026-09-01 05:26:21.818+00	PEPIzJ0WsP5IiUzvflpA7H12eoGVY9a9	2026-08-25 05:26:21.818+00	2026-08-25 05:26:21.818+00	223.217.42.33	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	\N
v4jwDPHqCJ91k2xIE3wC2Z4aYvmkR2gm	2026-09-02 01:45:24.129+00	hOprrJIuYbXG5ThcUmtB3pdH77mlSlpr	2026-08-26 01:45:24.129+00	2026-08-26 01:45:24.129+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
dwtI0V2FI1YHbafhZmERdWXDqoaymy2X	2026-09-04 01:53:10.082+00	fhBY65JWCSGQwfaBcmuc8OmBJ2h3GS5w	2026-08-28 01:53:10.082+00	2026-08-28 01:53:10.082+00	219.104.134.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	\N
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_settings (key, value, updated_at) FROM stdin;
heroBannerUrl	/images/ChatGPT-Image-Jun-27-2026-09_44_58-PM-1d9c6fee.png	2026-06-28 08:00:05.752+00
siteTitle	Asia Web3 Alliance Japan (AWAJ)	2026-06-28 08:00:05.755+00
presidentTitle	Asia Web3 Alliance Japan	2026-06-28 08:00:05.814+00
presidentBio	AWAJ was created to help startups navigate Japan's ecosystem and build meaningful relationships across government, investors, corporations, universities, and international markets.	2026-06-28 08:00:05.817+00
presidentPhotoUrl	/images/Screenshot-2026-06-11-211952-fb2fbac9.png	2026-06-28 08:00:05.821+00
siteDescription	Asia Web3 & AI Alliance Japan (AWAJ) connects startups, investors, and institutions across Asia and Japan's Web3 & AI ecosystem.	2026-06-28 08:00:05.758+00
siteKeywords	Web3, AI, Japan, Asia, blockchain, startups, alliance, AWAJ	2026-06-28 08:00:05.761+00
ogTitle		2026-06-28 08:00:05.765+00
presidentBgUrl	/images/a7b0708e-40c4-40ad-b60f-d50ffb31e620-a0a9d1fd.png	2026-06-28 08:00:05.824+00
membershipComparison	[{"label":"Access to member directory","values":["Limited","no","no","yes"]},{"label":"Invitations to public events","values":["yes","yes","yes","yes"]},{"label":"Newsletter & ecosystem updates","values":["yes","yes","yes","yes"]},{"label":"Community access","values":["yes","yes","yes","yes"]},{"label":"Startup resources","values":["no","yes","no","yes"]},{"label":"Industry reports & insights","values":["no","no","yes","yes"]},{"label":"Brand visibility on AWAJ Website","values":["yes","yes","yes","yes"]},{"label":"Matching services & introductions (on request)","values":["Paid (when needed)","Paid (when needed)","Paid (when needed)","yes"]},{"label":"Co-create programs & initiatives","values":["no","no","no","yes"]},{"label":"Private roundtables & executive dinners","values":["no","no","no","yes"]},{"label":"Access to Government & International Delegation Events Invitation-Only Executive Dinners with Industry and Policy Leaders","values":["no","Paid (when needed)","Paid (when needed)","yes"]},{"label":"**AWAJ Digital Economy Forum** – Gold or Title Sponsorship included with membership.","values":["no","no","no","yes"]}]	2026-06-29 06:30:09.764+00
membershipInfoBlocks	[{"icon":"CircleDollarSign","title":"Pay When You Need","desc":"Supporter, Startup & Corporate members pay only for services.","chipIcon":"BadgeCheck","chipText":"No hidden fees. Pay only for value."},{"icon":"BadgeCheck","title":"One Year Membership","desc":"Free membership. Pay only for matching, services, or programs.\\n","chipIcon":"Calendar","chipText":"12 Months of Access & Benefits"},{"icon":"HeartHandshake","title":"Flexible & Transparent","desc":"No hidden fees. Pay only for the services and value you choose.","chipIcon":"CreditCard","chipText":"Full Transparency, Always"},{"icon":"ShieldCheck","title":"Trusted Network","desc":"Join Asia's trusted Web3 community of leaders, builders, and investors.","chipIcon":"Users","chipText":"Connect. Collaborate. Grow."}]	2026-06-29 06:30:09.798+00
membershipCta	{"title":"Ready to be part of the future?","subtitle":"Join Asia Web3 Alliance Japan today.","primaryLabel":"Join Now","primaryUrl":"/contact","secondaryLabel":"Or Contact Us for More Information","secondaryUrl":"/contact"}	2026-06-29 06:30:09.803+00
headerLogoUrl	/images/AWAJ-ASIA-WEB3-ALLIANCE-JAPAN-logo-800-x-800-px-1--fa78150a.png	2026-06-28 08:00:05.746+00
footerLogoUrl	/images/ASIA-WEB3-ALLIANCE-JAPAN-9-1-780a3ab9.png	2026-06-28 08:00:05.749+00
ogDescription		2026-06-28 08:00:05.768+00
ogImageUrl	/images/7bfa5c91-845e-4e15-a164-376b0dbc47aa-d1d62935.png	2026-06-28 08:00:05.772+00
faviconUrl	/images/Untitled-design-265cdd9c.png	2026-06-28 08:00:05.775+00
presidentCtaLabel	Meet Leadership Team	2026-06-28 08:00:05.827+00
presidentCtaUrl	/team	2026-06-28 08:00:05.83+00
leadershipStats	[{"value":"500+","label":"Ecosystem Partners","icon":"Users"},{"value":"120+","label":"Corporate Members","icon":"Building2"},{"value":"200+","label":"Web3 Startups Supported","icon":"Rocket"},{"value":"10+","label":"Countries Connected","icon":"Globe"},{"value":"15+","label":"Events & Programs","icon":"Calendar"}]	2026-06-28 08:00:05.833+00
leadershipSectionTitle	Ecosystem Leaders Connected with AWAJ	2026-06-28 08:00:05.836+00
leadershipViewAllLabel	View All Leaders	2026-06-28 08:00:05.839+00
leadershipViewAllUrl	/team	2026-06-28 08:00:05.842+00
twitterHandle	https://x.com/AWAJ_official	2026-06-28 08:00:05.778+00
canonicalBaseUrl		2026-06-28 08:00:05.781+00
gaMeasurementId	G-Z1B4XB2NPG	2026-06-28 08:00:05.784+00
googleSiteVerification		2026-06-28 08:00:05.787+00
bingSiteVerification		2026-06-28 08:00:05.791+00
membershipEyebrow	One Year Membership	2026-06-28 08:00:05.794+00
membershipTitle	Membership Packages	2026-06-28 08:00:05.797+00
membershipSubtitle	Join Asia Web3 Alliance Japan and become part of a trusted network driving innovation, collaboration, and growth across the Web3 ecosystem.	2026-06-28 08:00:05.801+00
membershipHeroUrl	/images/ChatGPT-Image-Jun-28-2026-04_57_01-PM-fb9d3465.png	2026-06-28 08:00:05.804+00
presidentEyebrow	Led by builders who understand expansion	2026-06-28 08:00:05.807+00
presidentName	Hinza Asif	2026-06-28 08:00:05.811+00
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_members (id, name, role, bio, image_url, linkedin_url, sort_order, author_id, created_at, company) FROM stdin;
2	Sandy Carter	Chief Operating Officer	Chief Business Officer | Adweek AI Trailblazer Power 100  | Chief AI Officer | ex-AWS, ex-IBM | Forbes Contributor | LinkedIn Top Voice	\N	https://www.linkedin.com/in/sandyacarter/	2	seed	2026-06-14 13:35:32.899509+00	Unstoppable Domains
3	Leo Mizuhara	Founder & CEO	Founder and CEO of Hashnote and serves on the Advisory Board, bringing extensive expertise in digital assets, institutional finance, and blockchain innovation.	\N	https://www.linkedin.com/in/leo-mizuhara/	3	seed	2026-06-14 13:35:32.899509+00	Hashnote
4	David Palmer	Chief Product Officer	Chief Product Officer at PairPoint and Blockchain Lead at Vodafone Business, driving the development of enterprise blockchain solutions, digital identity infrastructure, and global Web3 innovation initiatives.	\N	https://www.linkedin.com/in/david-palmer-677a421b6/	4	seed	2026-06-14 13:35:32.899509+00	PairPoint 
1	Hinza Asif	Founder & Representative Director	Leading the alliance's mission to connect Asia's Web3 and AI ecosystem with Japan.	/images/Screenshot-2026-06-11-211952-407390a8.png	https://www.linkedin.com/in/hinza-asif/?locale=en	1	seed	2026-06-14 13:35:32.899509+00	AI & WEB3 ALLIANCE JAPAN
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", role, banned, "banReason", "banExpires") FROM stdin;
Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	Hinza Asif	hinza@asiaweb3alliance.jp	f	\N	2026-06-14 15:14:30.395+00	2026-06-14 15:14:30.395+00	admin	f	\N	\N
iGA1ocRqagZ2LlACY5F2owUXVh7dpZVd	Gaurav Sharma	gaurav.manu13@gmail.com	f	\N	2026-06-15 02:46:02.84+00	2026-06-15 02:46:02.84+00	superadmin	f	\N	\N
4vbFW10lrYeoiizfxCDxhmyKILXa98M2	Faiza 	fuhmtrading@gmail.com	f	\N	2026-07-10 08:59:43.724+00	2026-07-10 08:59:43.724+00	admin	f	\N	\N
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
XVZ1AbBJS9zQfXGAvx5OrBDX7di8baiZ	reset-password:j369bQNvDYZF09j3hSWdrJ0E	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-06-19 19:20:33.239+00	2026-06-19 18:20:33.24+00	2026-06-19 18:20:33.24+00
9623admmXdN3oLZzU6gncyvaBuGb6tcY	reset-password:0Qtr2cPGYNFoHVlpalNVxRXq	Ia9GrJbO7WhD23NyR7ZN22wBbzLIysn9	2026-07-07 15:30:35.819+00	2026-07-07 14:30:35.821+00	2026-07-07 14:30:35.821+00
\.


--
-- Name: ads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ads_id_seq', 12, true);


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.banners_id_seq', 9, true);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 15, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.events_id_seq', 21, true);


--
-- Name: events_organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.events_organizations_id_seq', 628, true);


--
-- Name: events_people_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.events_people_id_seq', 667, true);


--
-- Name: galleries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.galleries_id_seq', 6, true);


--
-- Name: japan_hub_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.japan_hub_applications_id_seq', 1, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_id_seq', 17, true);


--
-- Name: member_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.member_applications_id_seq', 39, true);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.members_id_seq', 36, true);


--
-- Name: membership_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.membership_plans_id_seq', 4, true);


--
-- Name: news_articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_articles_id_seq', 15, true);


--
-- Name: news_organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_organizations_id_seq', 2, true);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.newsletter_subscribers_id_seq', 4, true);


--
-- Name: organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.organizations_id_seq', 155, true);


--
-- Name: partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.partners_id_seq', 14, true);


--
-- Name: people_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.people_id_seq', 107, true);


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.playing_with_neon_id_seq', 10, true);


--
-- Name: program_overview_cta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.program_overview_cta_id_seq', 6, true);


--
-- Name: program_overview_feature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.program_overview_feature_id_seq', 6, true);


--
-- Name: program_overview_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.program_overview_id_seq', 1, true);


--
-- Name: program_overview_language_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.program_overview_language_id_seq', 7, true);


--
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.programs_id_seq', 4, true);


--
-- Name: programs_organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.programs_organizations_id_seq', 31, true);


--
-- Name: programs_people_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.programs_people_id_seq', 10, true);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.team_members_id_seq', 4, true);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: invitation invitation_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT invitation_pkey PRIMARY KEY (id);


--
-- Name: jwks jwks_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.jwks
    ADD CONSTRAINT jwks_pkey PRIMARY KEY (id);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: organization organization_slug_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_slug_key UNIQUE (slug);


--
-- Name: project_config project_config_endpoint_id_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_endpoint_id_key UNIQUE (endpoint_id);


--
-- Name: project_config project_config_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_token_key UNIQUE (token);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: ads ads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ads
    ADD CONSTRAINT ads_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: events_organizations events_organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events_organizations
    ADD CONSTRAINT events_organizations_pkey PRIMARY KEY (id);


--
-- Name: events_people events_people_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events_people
    ADD CONSTRAINT events_people_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: events events_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_slug_key UNIQUE (slug);


--
-- Name: galleries galleries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries
    ADD CONSTRAINT galleries_pkey PRIMARY KEY (id);


--
-- Name: japan_hub_applications japan_hub_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.japan_hub_applications
    ADD CONSTRAINT japan_hub_applications_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: member_applications member_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_applications
    ADD CONSTRAINT member_applications_pkey PRIMARY KEY (id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: membership_plans membership_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.membership_plans
    ADD CONSTRAINT membership_plans_pkey PRIMARY KEY (id);


--
-- Name: news_articles news_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_articles
    ADD CONSTRAINT news_articles_pkey PRIMARY KEY (id);


--
-- Name: news_articles news_articles_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_articles
    ADD CONSTRAINT news_articles_slug_key UNIQUE (slug);


--
-- Name: news_organizations news_organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_organizations
    ADD CONSTRAINT news_organizations_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: people people_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pkey PRIMARY KEY (id);


--
-- Name: playing_with_neon playing_with_neon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playing_with_neon
    ADD CONSTRAINT playing_with_neon_pkey PRIMARY KEY (id);


--
-- Name: program_overview_cta program_overview_cta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview_cta
    ADD CONSTRAINT program_overview_cta_pkey PRIMARY KEY (id);


--
-- Name: program_overview_feature program_overview_feature_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview_feature
    ADD CONSTRAINT program_overview_feature_pkey PRIMARY KEY (id);


--
-- Name: program_overview_language program_overview_language_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview_language
    ADD CONSTRAINT program_overview_language_pkey PRIMARY KEY (id);


--
-- Name: program_overview program_overview_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview
    ADD CONSTRAINT program_overview_pkey PRIMARY KEY (id);


--
-- Name: program_overview program_overview_program_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview
    ADD CONSTRAINT program_overview_program_id_key UNIQUE (program_id);


--
-- Name: programs_organizations programs_organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs_organizations
    ADD CONSTRAINT programs_organizations_pkey PRIMARY KEY (id);


--
-- Name: programs_people programs_people_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs_people
    ADD CONSTRAINT programs_people_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: programs programs_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_slug_key UNIQUE (slug);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_token_key UNIQUE (token);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (key);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: account_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "account_userId_idx" ON neon_auth.account USING btree ("userId");


--
-- Name: invitation_email_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX invitation_email_idx ON neon_auth.invitation USING btree (email);


--
-- Name: invitation_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "invitation_organizationId_idx" ON neon_auth.invitation USING btree ("organizationId");


--
-- Name: member_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_organizationId_idx" ON neon_auth.member USING btree ("organizationId");


--
-- Name: member_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_userId_idx" ON neon_auth.member USING btree ("userId");


--
-- Name: organization_slug_uidx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE UNIQUE INDEX organization_slug_uidx ON neon_auth.organization USING btree (slug);


--
-- Name: session_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "session_userId_idx" ON neon_auth.session USING btree ("userId");


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX verification_identifier_idx ON neon_auth.verification USING btree (identifier);


--
-- Name: ads_page_target_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ads_page_target_idx ON public.ads USING btree (page_target);


--
-- Name: ads_placement_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ads_placement_idx ON public.ads USING btree (placement);


--
-- Name: events_organizations_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX events_organizations_unique_idx ON public.events_organizations USING btree (event_id, organization_id);


--
-- Name: member_applications_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX member_applications_status_idx ON public.member_applications USING btree (status);


--
-- Name: news_organizations_news_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_organizations_news_id_idx ON public.news_organizations USING btree (news_id);


--
-- Name: news_organizations_org_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_organizations_org_id_idx ON public.news_organizations USING btree (organization_id);


--
-- Name: organizations_name_lower_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX organizations_name_lower_idx ON public.organizations USING btree (lower(name));


--
-- Name: organizations_name_lower_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX organizations_name_lower_unique ON public.organizations USING btree (lower(name));


--
-- Name: people_email_lower_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX people_email_lower_unique ON public.people USING btree (lower(email)) WHERE ((email IS NOT NULL) AND (email <> ''::text));


--
-- Name: people_organization_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX people_organization_id_idx ON public.people USING btree (organization_id);


--
-- Name: programs_organizations_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX programs_organizations_unique_idx ON public.programs_organizations USING btree (program_id, organization_id);


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_inviterId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: media media_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id) ON DELETE SET NULL;


--
-- Name: people people_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;


--
-- Name: program_overview_cta program_overview_cta_overview_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview_cta
    ADD CONSTRAINT program_overview_cta_overview_id_fkey FOREIGN KEY (overview_id) REFERENCES public.program_overview(id) ON DELETE CASCADE;


--
-- Name: program_overview_feature program_overview_feature_overview_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview_feature
    ADD CONSTRAINT program_overview_feature_overview_id_fkey FOREIGN KEY (overview_id) REFERENCES public.program_overview(id) ON DELETE CASCADE;


--
-- Name: program_overview_language program_overview_language_overview_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview_language
    ADD CONSTRAINT program_overview_language_overview_id_fkey FOREIGN KEY (overview_id) REFERENCES public.program_overview(id) ON DELETE CASCADE;


--
-- Name: program_overview program_overview_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_overview
    ADD CONSTRAINT program_overview_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id) ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict jrlgB27ZZYIDcgmze5EfFiT9eQY7ZXHAxBjOFup7NU0DeLXCWra02eQVPz0FBfs

