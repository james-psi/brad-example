DO $$ BEGIN
 CREATE TYPE "shadcn_assigned_to" AS ENUM('division 1', 'division 2', 'division 3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shadcn_category" AS ENUM('criminal_case', 'civil_case', 'family_case', 'administrative_case');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shadcn_last_action_taken" AS ENUM('filed motion', 'received motion', 'case closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shadcn_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shadcn_tasks" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"status" "shadcn_status" DEFAULT 'active' NOT NULL,
	"category" "shadcn_category" DEFAULT 'criminal_case' NOT NULL,
	"assigned_to" "shadcn_assigned_to" DEFAULT 'division 1' NOT NULL,
	"last_action_taken" "shadcn_last_action_taken" DEFAULT 'filed motion' NOT NULL,
	"last_action_date" timestamp DEFAULT '2024-03-19 15:18:05.159' NOT NULL
);
