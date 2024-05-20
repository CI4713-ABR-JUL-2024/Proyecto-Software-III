export interface error_object {
    error_message: string
    error_message_detail: string
    error_code: string
    status: number
  }
  
  export interface error_message_dictionary {
    [code: string]: string
  }
  