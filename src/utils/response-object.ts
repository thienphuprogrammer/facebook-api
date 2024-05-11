export default class ResponseObject {
  status: number;
  message: string;
  data: any;
  error: any;

  constructor(status: number, message: string, data: any, error: any) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
