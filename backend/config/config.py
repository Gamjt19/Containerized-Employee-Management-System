import os

from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()


class Config:
    """Base configuration."""

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "dev-secret-key-12345"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Database connection parameters from environment variables
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "employee_db")
    DB_USER = os.getenv("DB_USER", "employee_user")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        """Build the database connection URI."""
        custom_url = os.getenv("DATABASE_URL")

        if custom_url:
            return custom_url

        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


class DevelopmentConfig(Config):
    """Development environment configuration."""

    DEBUG = True


class TestingConfig(Config):
    """Testing environment configuration using SQLite in-memory database."""

    TESTING = True
    DEBUG = True

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return "sqlite:///:memory:"


class ProductionConfig(Config):
    """Production environment configuration."""

    DEBUG = False


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}


def get_config():
    """Return configuration based on FLASK_ENV."""
    env = os.getenv(
        "FLASK_ENV",
        "development"
    ).lower()

    return config_by_name.get(
        env,
        DevelopmentConfig
    )()
