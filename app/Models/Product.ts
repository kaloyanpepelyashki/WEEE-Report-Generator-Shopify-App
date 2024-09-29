class Product {
  public id: number;
  public title: string;
  public weight: number;
  public imageId: number;
  public imageUrl: string;
  constructor(
    productId: number,
    productTitle: string,
    productWeight: number,
    imageId: number,
    productImageUrl: string,
  ) {
    this.id = productId;
    this.title = productTitle;
    this.weight = productWeight;
    this.imageId = imageId;
    this.imageUrl = productImageUrl;
  }
}

export default Product;
