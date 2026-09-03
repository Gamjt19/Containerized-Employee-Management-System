from config import TestingConfig


def test_testing_config_disables_ssl_engine_options():
    """Testing config should not pass SSL args to SQLite connections."""
    config = TestingConfig()
    assert config.SQLALCHEMY_ENGINE_OPTIONS == {}
