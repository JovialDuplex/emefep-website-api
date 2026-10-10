CREATE DATABASE IF NOT EXISTS emefep
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE emefep;

-- ---------------------------------------------------------------------
--  categories
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    id                      INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_name           VARCHAR(150) NOT NULL,
    category_desc           TEXT         NOT NULL,
    category_image_preview  VARCHAR(500) NOT NULL,
    category_created_date   DATE         NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT unq_categories_name UNIQUE (category_name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  company_infos
-- ---------------------------------------------------------------------
CREATE TABLE company_infos (
    id                      INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    company_location        VARCHAR(100) NOT NULL COMMENT 'localisation de l''entreprise',
    company_call_phone      VARCHAR(30)  NOT NULL COMMENT 'le numero d''appel de la company',
    company_whatsapp_phone  VARCHAR(30)  NULL     COMMENT 'le numero whatsapp de l''entreprise',
    company_name            VARCHAR(150) NOT NULL DEFAULT 'EMEFEP',
    company_desc            VARCHAR(500) NOT NULL COMMENT 'breve description globale de l''entreprise',
    company_logo_url        VARCHAR(500) NOT NULL COMMENT 'logo de la company',
    company_email           VARCHAR(150) NOT NULL,
    company_slogan          VARCHAR(150) NULL,
    CONSTRAINT unq_company_infos UNIQUE (company_email, company_location)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  company_stats
-- ---------------------------------------------------------------------
CREATE TABLE company_stats (
    id          INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stat_label  VARCHAR(150) NOT NULL,
    stat_value  VARCHAR(16)  NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'statistiques de l''entreprise, ex : stat_label = "classement de l''entreprise", stat_value = "23eme"';

-- ---------------------------------------------------------------------
--  members
-- ---------------------------------------------------------------------
CREATE TABLE members (
    id                 INT              NOT NULL AUTO_INCREMENT PRIMARY KEY
                                        COMMENT 'identifiant du membre de l''entreprise',
    member_name        VARCHAR(150)     NOT NULL,
    member_role        VARCHAR(200)     NOT NULL,
    member_experience  TINYINT UNSIGNED NOT NULL COMMENT 'annees d''experience',
    member_bio         TEXT             NOT NULL,
    member_image       VARCHAR(500)     NULL,
    member_category    INT              NOT NULL,
    member_phone       VARCHAR(30)      NULL,
    member_email       VARCHAR(150)     NOT NULL,
    CONSTRAINT unq_members UNIQUE (member_email),
    CONSTRAINT fk_members_categories FOREIGN KEY (member_category)
        REFERENCES categories (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'modele qui represente les membres de la company';

-- ---------------------------------------------------------------------
--  product
-- ---------------------------------------------------------------------
CREATE TABLE product (
    id                    INT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY
                                        COMMENT 'identifiant unique a chaque produit',
    product_name          VARCHAR(200)  NOT NULL COMMENT 'nom du produit',
    product_price         DECIMAL(12,2) NOT NULL DEFAULT 5000.00 COMMENT 'prix du produit',
    product_desc          VARCHAR(500)  NOT NULL COMMENT 'description du produit',
    product_category      INT           NOT NULL,
    product_details       JSON          NULL,
    product_slug          VARCHAR(100)  NOT NULL,
    product_image         VARCHAR(500)  NOT NULL,
    product_created_date  DATE          NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT unq_product UNIQUE (product_slug),
    CONSTRAINT chk_product_price CHECK (product_price >= 0),
    CONSTRAINT fk_product_categories FOREIGN KEY (product_category)
        REFERENCES categories (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  projects
-- ---------------------------------------------------------------------
CREATE TABLE projects (
    id                   INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    project_name         VARCHAR(200) NOT NULL,
    project_desc         TEXT         NOT NULL,
    project_client_name  VARCHAR(150) NOT NULL,
    project_demo_url     VARCHAR(500) NULL,
    project_start_date   DATE         NOT NULL,
    project_end_date     DATE         NULL COMMENT 'NULL = projet en cours',
    project_slug         VARCHAR(100) NOT NULL,
    project_category     INT          NOT NULL,
    CONSTRAINT unq_projects UNIQUE (project_slug),
    CONSTRAINT chk_projects_dates CHECK (project_end_date IS NULL OR project_end_date >= project_start_date),
    CONSTRAINT fk_projects_categories FOREIGN KEY (project_category)
        REFERENCES categories (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'table qui decrit les realisations effectuees par l''entreprise';

-- ---------------------------------------------------------------------
--  service
-- ---------------------------------------------------------------------
CREATE TABLE service (
    id                    INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
                                       COMMENT 'identifiant du service',
    service_name          VARCHAR(150) NOT NULL COMMENT 'nom du service',
    service_desc          VARCHAR(500) NOT NULL COMMENT 'description du service',
    service_image         VARCHAR(500) NOT NULL COMMENT 'image de presentation du service',
    service_details       JSON         NULL
                          DEFAULT (JSON_OBJECT('intervention_time', '2 jours'))
                          COMMENT 'details sur le service',
    service_created_date  DATE         NOT NULL DEFAULT (CURRENT_DATE) COMMENT 'date de publication du service',
    service_category      INT          NULL,
    service_slug          VARCHAR(150) NOT NULL,
    CONSTRAINT unq_service UNIQUE (service_slug),
    CONSTRAINT fk_service_categories FOREIGN KEY (service_category)
        REFERENCES categories (id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  users
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                  INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_full_name      VARCHAR(200) NOT NULL,
    user_phone          VARCHAR(30)  NULL,
    user_image          VARCHAR(500) NULL,
    user_email          VARCHAR(150) NOT NULL,
    user_date_register  DATE         NOT NULL DEFAULT (CURRENT_DATE),
    user_role           ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    user_firebase_uid   VARCHAR(128) NOT NULL,
    user_auth_provider  ENUM('google', 'facebook', 'github', 'password') NOT NULL DEFAULT 'password',
    CONSTRAINT unq_users_email        UNIQUE (user_email),
    CONSTRAINT unq_users_firebase_uid UNIQUE (user_firebase_uid),
    CONSTRAINT unq_users_phone        UNIQUE (user_phone)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
