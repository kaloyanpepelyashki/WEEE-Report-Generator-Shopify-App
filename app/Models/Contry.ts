class Country {
  public value: string;
  constructor(
    public objectId: string,
    public label: string,
    value: string,
    public key: string,
  ) {
    this.value = value.toLowerCase();
  }
}

export default Country;
