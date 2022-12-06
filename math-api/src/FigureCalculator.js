class FigureCalculator {
  constructor(mathBasic) {
    this._mathBasic = mathBasic;
  }

  _validateArgs(args, expectedArgsCount) {
    this._args = args;
    if (this._args.length !== expectedArgsCount) {
      throw new Error(`fungsi hanya menerima ${expectedArgsCount} parameter`);
    }

    this._args.forEach((arg) => {
      if (typeof arg !== 'number') {
        throw new Error('fungsi hanya menerima parameter number');
      }
    });

    return this._args;
  }

  calculateRectanglePerimeter(...args) {
    const [length, width] = this._validateArgs(args, 2);
    return this._mathBasic.multiply(2, this._mathBasic.add(length, width));
  }

  calculateRectangleArea(...args) {
    const [length, width] = this._validateArgs(args, 2);
    return this._mathBasic.multiply(length, width);
  }

  calculateTrianglePerimeter(...args) {
    const [sideA, sideB, base] = this._validateArgs(args, 3);
    return this._mathBasic.add(this._mathBasic.add(sideA, sideB), base);
  }

  calculateTriangleArea(...args) {
    const [base, height] = this._validateArgs(args, 2);
    return this._mathBasic.divide(this._mathBasic.multiply(base, height), 2);
  }
}

module.exports = FigureCalculator;
