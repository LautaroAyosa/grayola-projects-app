export type UserProfile = {
    id: string
    full_name: string | null
    created_at: string
    role_id: string | null
    organization_id: string | null
}

export type User = {
    UID: string,
    Email: string,
}