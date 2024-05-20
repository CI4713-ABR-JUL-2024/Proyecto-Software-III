export function add_property(
    obj: any,
    property_name: string,
    value: any,
  ): void {
    obj[property_name] = value
  }
  
  export function add_object_to_array<T>(
    array: T[],
    value_name: string,
    value: any,
  ): T[] {
    let new_object: { [key: string]: any } = {}
    new_object[value_name] = value
  
    return [...array, new_object] as T[]
  }
  export function add_object_property<T>(
    input_object: T,
    value_name: string,
    value: any,
  ): T & { [key: string]: any } {
    const new_object = { ...input_object, [value_name]: value } as T & {
      [key: string]: any
    }
    return new_object
  }
  
  /**
   *
   * @param date en formato mm/dd/yy
   * @returns
   */
  export const formatDateToDb = (date: string) => {
    const dateArray = date.split('/')
    const dateFormartedForDb = new Date(date)
    return dateFormartedForDb
  }
  
  export const formatDateToFront = (date: Date) => {
   // formateamos la fecha para salida en formato dd/mm/yyyy hh:mm:ss
   const formattedDate = new Date(date);
  
   // Obtenemos los componentes de la fecha
   const day = formattedDate.getDate();
   const month = formattedDate.getMonth() + 1; // Se suma 1 porque los meses comienzan en 0
   const year = formattedDate.getFullYear();
  
   // Obtenemos los componentes de la hora
   const hours = formattedDate.getHours().toString().padStart(2, '0');
   const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
   const seconds = formattedDate.getSeconds().toString().padStart(2, '0');
  
   // Formateamos la fecha y la hora
   const formattedDateString = `${day}/${month}/${year}`;
   const formattedTimeString = `${hours}:${minutes}:${seconds}`;
  
   // Retornamos la fecha y la hora formateadas
   return `${formattedDateString} ${formattedTimeString}`;
  }
  
  export const verifyDate = (date: Date) => {
    const dateNow = new Date()
    // Para poder comparar fechas, eliminamos la hora, minuto, segundo y milisegundo
    dateNow.setHours(0, 0, 0, 0)
    if (date < dateNow) {
      throw new Error('La fecha debe ser mayor o igual a la fecha actual')
    }
    return true
  }
  