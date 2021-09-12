
export default class ApiException extends Error {

  constructor(message, status, error) {
    super(message, error);

    this.status = status;
  }

}