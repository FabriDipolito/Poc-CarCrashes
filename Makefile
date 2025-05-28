.PHONY: \
	api-install api-build api-prod-run \
	etl-install etl-build etl-prod-run \
	fe-install fe-build fe-prod-run \
	prod-run-all db-init

########################
# API (Spring Boot)
########################

api-install:
	@echo "📦 Installing API dependencies"
	cd API && mvn install -DskipTests

api-run:
	@echo "Running API 🚀"
	cd API && DB_PATH=jdbc:sqlite:file:../data.db SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run

api-build:
	@echo "🏗️ Building API production .jar"
	cd API && mvn clean package -DskipTests

api-prod-run:
	@echo "🚀 Running API in production"
	cd API/target && DB_PATH=jdbc:sqlite:file:../../data.db SPRING_PROFILES_ACTIVE=dev java -jar $$(ls *.jar | grep -v 'original' | head -n 1)


########################
# ETL (Java project)
########################

etl-install:
	@echo "📦 Installing ETL dependencies"
	cd ETL && mvn install -DskipTests

etl-run:
	@echo "Running ETL 🚀"
	cd ETL && SPRING_PROFILES_ACTIVE=dev DB_PATH=jdbc:sqlite:file:../data.db mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"

etl-build:
	@echo "🏗️ Building ETL .jar"
	cd ETL && mvn clean package -DskipTests

etl-prod-run:
	@echo "⚙️ Running ETL"
	cd ETL/target && DB_PATH=jdbc:sqlite:file:../../data.db SPRING_PROFILES_ACTIVE=prod java -jar $$(ls *.jar | grep -v 'original' | head -n 1) --server.port=8081

########################
# Frontend (Next.js)
########################

fe-install:
	@echo "📦 Installing Frontend dependencies"
	cd Frontend && npm install --legacy-peer-deps

fe-dev:
	@echo "Starting frontend dev-server 🚀"
	cd Frontend && npm run dev

fe-build:
	@echo "🏗️ Building Frontend (Next.js)"
	cd Frontend && npm run build

fe-prod-run:
	@echo "🚀 Running Frontend in production"
	cd Frontend && npm start

########################
# RUN EVERYTHING IN PROD
########################

prod-run-all: api-install etl-install fe-install api-build etl-build fe-build
	@echo "🚀 Starting all services in production mode..."
	@echo "🔵 1. Running API (port 8080)"
	cd API/target && DB_PATH=jdbc:sqlite:file:../../data.db SPRING_PROFILES_ACTIVE=prod java -jar $$(ls *.jar | grep -v 'original' | head -n 1) &
	@echo "🟡 2. Running ETL (port 8081)"
	cd ETL/target && DB_PATH=jdbc:sqlite:file:../../data.db SPRING_PROFILES_ACTIVE=prod java -jar $$(ls *.jar | grep -v 'original' | head -n 1) --server.port=8081 &
	@echo "🟢 3. Running Frontend (port 3000)"
	cd Frontend && npm start

########################
# RUN EVERYTHING IN DEV
########################

dev-run-all: api-install etl-install fe-install
	@echo "🚀 Starting all services in development mode..."
	@echo "🔵 1. Running API (port 8080)"
	cd API && DB_PATH=jdbc:sqlite:file:../data.db SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run &
	@echo "🟡 2. Running ETL (port 8081)"
	cd ETL && DB_PATH=jdbc:sqlite:file:../data.db SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081 &
	@echo "🟢 3. Running Frontend (port 3000)"
	cd Frontend && npm run dev

########################
# Initialize SQLite DB
########################

db-init:
	@echo "🧩 Initializing SQLite DB"
	sqlite3 data.db "CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, access_jwt_times INTEGER NOT NULL, refresh_jwt_times INTEGER NOT NULL);"
	sqlite3 data.db "CREATE TABLE IF NOT EXISTS accidents ( \
		case_id BIGINT PRIMARY KEY, \
		year VARCHAR NOT NULL, \
		county_name VARCHAR, \
		crash_date VARCHAR, \
		fatals INTEGER NOT NULL, \
		peds INTEGER NOT NULL, \
		persons INTEGER NOT NULL, \
		state INTEGER NOT NULL, \
		state_name VARCHAR, \
		total_vehicles INTEGER NOT NULL \
	);"
	sqlite3 data.db "CREATE TABLE IF NOT EXISTS vehicle ( \
		vehicle_id INTEGER PRIMARY KEY, \
		accident_id BIGINT, \
		body_type INTEGER, \
		body_type_name VARCHAR, \
		make_id INTEGER, \
		make_name VARCHAR, \
		model INTEGER, \
		model_name VARCHAR, \
		model_year VARCHAR, \
		year VARCHAR, \
		FOREIGN KEY(accident_id) REFERENCES accidents(case_id) \
	);"
	sqlite3 data.db "CREATE TABLE IF NOT EXISTS feedback ( \
		id INTEGER PRIMARY KEY AUTOINCREMENT, \
		email TEXT NOT NULL, \
		message TEXT NOT NULL \
	);"
	@echo "✅ DB ready"