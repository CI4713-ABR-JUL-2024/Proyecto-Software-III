export interface user_body_create {
    name: string
    last_name: string
    email: string
    role?: string
    telephone: string
    password: string
    speciality? : string
  }
  
  export interface filters {
    search_field?: string
    search_text?: string
  }
  
  export interface user_body_update {
    name: string
  }
  
  export interface user_body_update_password{
    oldPassword: string
    newPassword: string
    compareNewPassword: string
  }
  
  export interface user_data {
    id: number,
    role: string,
  }
  