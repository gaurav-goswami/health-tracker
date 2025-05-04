const BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080"}/api/v1`;

const auth_url = `${BASE_URL}/auth/login`;
const health_record = `${BASE_URL}/health`;

export const routes = {
    auth_url,
    health_record
};