"""Rate limiting middleware for API protection."""
import time
from collections import defaultdict
from typing import Dict, Tuple
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimiter:
    """
    Simple in-memory rate limiter.
    Note: For production, use Redis-backed rate limiting.
    """
    
    def __init__(self):
        self.requests: Dict[str, list] = defaultdict(list)
        self.limits = {
            "login": (5, 60),      # 5 requests per 60 seconds
            "upload": (10, 60),    # 10 requests per 60 seconds
            "default": (100, 60)   # 100 requests per 60 seconds
        }
    
    def is_allowed(self, key: str, limit_type: str = "default") -> Tuple[bool, int]:
        """
        Check if request is allowed.
        
        Returns:
            Tuple of (is_allowed, retry_after_seconds)
        """
        limit, window = self.limits.get(limit_type, self.limits["default"])
        now = time.time()
        
        # Clean old requests
        self.requests[key] = [t for t in self.requests[key] if now - t < window]
        
        if len(self.requests[key]) >= limit:
            oldest = min(self.requests[key])
            retry_after = int(window - (now - oldest)) + 1
            return False, retry_after
        
        self.requests[key].append(now)
        return True, 0


class RateLimitMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for rate limiting."""
    
    def __init__(self, app, limiter: RateLimiter = None):
        super().__init__(app)
        self.limiter = limiter or RateLimiter()
    
    async def dispatch(self, request: Request, call_next):
        # Determine rate limit type from request
        path = request.url.path
        
        if "/auth/register" in path or "/auth/token" in path:
            limit_type = "login"
        elif "/documents/upload" in path:
            limit_type = "upload"
        else:
            limit_type = "default"
        
        # Create key from client IP and path
        client_ip = request.client.host if request.client else "unknown"
        key = f"{client_ip}:{path}"
        
        # Check rate limit
        allowed, retry_after = self.limiter.is_allowed(key, limit_type)
        
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Try again in {retry_after} seconds.",
                headers={"Retry-After": str(retry_after)}
            )
        
        response = await call_next(request)
        return response
