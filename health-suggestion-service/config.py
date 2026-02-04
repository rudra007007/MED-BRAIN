"""
Configuration for Health Suggestion Microservice.
Loads settings from config.yaml with environment variable override support.
"""

import os
from pathlib import Path
from typing import Optional
import yaml


class Config:
    """Configuration management for the health suggestion service."""
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize configuration.
        
        Args:
            config_path: Path to config.yaml file. Defaults to config.yaml in service directory.
        """
        if config_path is None:
            config_path = Path(__file__).parent / "config.yaml"
        
        self.config_path = Path(config_path)
        self._config = self._load_config()
    
    def _load_config(self) -> dict:
        """Load configuration from YAML file."""
        if not self.config_path.exists():
            return {}
        
        with open(self.config_path, 'r') as f:
            return yaml.safe_load(f) or {}
    
    def get(self, key: str, default=None):
        """
        Get configuration value.
        
        Priority: environment variable > config file > default
        
        Args:
            key: Configuration key (supports dot notation for nested keys)
            default: Default value if key not found
            
        Returns:
            Configuration value
        """
        # Check environment variable first
        env_key = key.upper().replace('.', '_')
        env_value = os.environ.get(env_key)
        if env_value is not None:
            return env_value
        
        # Check config file with dot notation support
        keys = key.split('.')
        value = self._config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
        
        return value if value is not None else default
    
    @property
    def app_host(self) -> str:
        """Application host address."""
        return self.get('app.host', '0.0.0.0')
    
    @property
    def app_port(self) -> int:
        """Application port number."""
        return int(self.get('app.port', 8000))
    
    @property
    def debug(self) -> bool:
        """Enable debug mode."""
        return self.get('app.debug', False)
    
    @property
    def log_level(self) -> str:
        """Logging level."""
        return self.get('app.log_level', 'INFO')


# Global configuration instance
config = Config()
