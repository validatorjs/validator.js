export default function isJWTExpiration(token) {
    if (!token || typeof token !== 'string') {
        return false;
    }
    try {
    
      const payload = JSON.parse(atob(token.split('.')[1]));
  
      if (payload.exp && typeof payload.exp === 'number') {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return payload.exp >= currentTimestamp;
      }
  
      return false; 
    } catch (error) {
      console.error("Error parsing JWT payload:", error.message);
      return false; 
    }
  }
  