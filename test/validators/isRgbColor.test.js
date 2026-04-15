import test from '../testFunctions';

describe('isRgbColor', () => {
  it('should validate rgb color strings', () => {
    test({
      validator: 'isRgbColor',
      valid: [
        'rgb(0,0,0)',
        'rgb(255,255,255)',
        'rgba(0,0,0,0)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,.1)',
        'rgba(255,255,255,0.1)',
        'rgba(255,255,255,.12)',
        'rgb(5%,5%,5%)',
        'rgba(5%,5%,5%,.3)',
        'rgba(5%,5%,5%,.32)',
      ],
      invalid: [
        'rgb(0,0,0,)',
        'rgb(0,0,)',
        'rgb(0,0,256)',
        'rgb()',
        'rgba(0,0,0)',
        'rgba(255,255,255,2)',
        'rgba(255,255,255,.123)',
        'rgba(255,255,256,0.1)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgba(5%,5%,5%,.321)',
        'rgb(101%,101%,101%)',
        'rgba(3%,3%,101%,0.3)',
        'rgb(101%,101%,101%) additional invalid string part',
        'rgba(3%,3%,101%,0.3) additional invalid string part',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rg ba(0, 251, 22, 0.5)',
        'rgb( 255,255 ,255)',
        'rgba(255, 255, 255, 0.5)',
        'rgba(255, 255, 255, 0.5)',
        'rgb(5%, 5%, 5%)',
      ],
    });

    // test empty options object
    test({
      validator: 'isRgbColor',
      args: [{}],
      valid: [
        'rgb(0,0,0)',
        'rgb(255,255,255)',
        'rgba(0,0,0,0)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,.1)',
        'rgba(255,255,255,.12)',
        'rgba(255,255,255,0.1)',
        'rgb(5%,5%,5%)',
        'rgba(5%,5%,5%,.3)',
      ],
      invalid: [
        'rgb(0,0,0,)',
        'rgb(0,0,)',
        'rgb(0,0,256)',
        'rgb()',
        'rgba(0,0,0)',
        'rgba(255,255,255,2)',
        'rgba(255,255,256,0.1)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgb(101%,101%,101%)',
        'rgba(3%,3%,101%,0.3)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rg ba(0, 251, 22, 0.5)',
        'rgb( 255,255 ,255)',
        'rgba(255, 255, 255, 0.5)',
        'rgba(255, 255, 255, 0.5)',
        'rgb(5%, 5%, 5%)',
      ],
    });
    // test where includePercentValues is given as false
    test({
      validator: 'isRgbColor',
      args: [false],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
      ],
      invalid: [
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
      ],
    });

    // test where includePercentValues is given as false as part of options object
    test({
      validator: 'isRgbColor',
      args: [{ includePercentValues: false }],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
      ],
      invalid: [
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'r         g    b(   0,         251,       222     )',
        'rgba(255, 255, 255 ,0.2)',
        'r         g    ba(   0,         251,       222     )',
      ],
    });

    // test where include percent is true explciitly
    test({
      validator: 'isRgbColor',
      args: [true],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
        'rgb(0,0,0)',
        'rgb(255,255,255)',
        'rgba(0,0,0,0)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,.1)',
        'rgba(255,255,255,.12)',
        'rgba(255,255,255,0.1)',
        'rgb(5%,5%,5%)',
        'rgba(5%,5%,5%,.3)',
        'rgb(5%,5%,5%)',
        'rgba(255,255,255,0.5)',
      ],
      invalid: [
        'rgba(255, 255, 255, 0.5)',
        'rgb(5%, 5%, 5%)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rgb(0,0,0,)',
        'rgb(0,0,)',
        'rgb(0,0,256)',
        'rgb()',
        'rgba(0,0,0)',
        'rgba(255,255,255,2)',
        'rgba(255,255,256,0.1)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgb(101%,101%,101%)',
        'rgba(3%,3%,101%,0.3)',
      ],
    });

    // test where percent value is false and allowSpaces is true as part of options object
    test({
      validator: 'isRgbColor',
      args: [{ includePercentValues: false, allowSpaces: true }],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
        'rgba(255,255,255,0.2)',
        'rgba(255, 255, 255 ,0.2)',
      ],
      invalid: [
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(5% ,5%, 5%)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rgb(0,0,)',
        'rgb()',
        'rgb(4,4,5%)',
        'rgb(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgb(101%, 101%, 101%)',
        'rgba(3%,3%,101%,0.3)',
      ],

    });

    // test where both are true as part of options object
    test({
      validator: 'isRgbColor',
      args: [{ includePercentValues: true, allowSpaces: true }],
      valid: [
        'rgb(  5, 5, 5)',
        'rgba(5, 5, 5, .3)',
        'rgb(0, 0, 0)',
        'rgb(255, 255, 255)',
        'rgba(0, 0, 0, 0)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, .1)',
        'rgba(255, 255, 255, 0.1)',
        'rgb(5% ,5% ,5%)',
        'rgba(5%,5%,5%, .3)',
      ],
      invalid: [
        'r         g    b(   0,         251,       222     )',
        'rgb(4,4,5%)',
        'rgb(101%,101%,101%)',

      ],
    });

    // test where allowSpaces is false as part of options object
    test({
      validator: 'isRgbColor',
      args: [{ includePercentValues: true, allowSpaces: false }],
      valid: [
        'rgb(5,5,5)',
        'rgba(5,5,5,.3)',
        'rgb(0,0,0)',
        'rgb(255,255,255)',
        'rgba(0,0,0,0)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,.1)',
        'rgba(255,255,255,.12)',
        'rgba(255,255,255,0.1)',
        'rgb(5%,5%,5%)',
        'rgba(5%,5%,5%,.3)',

      ],
      invalid: [
        'rgb( 255,255 ,255)',
        'rgba(255, 255, 255, 0.5)',
        'rgb(5%, 5%, 5%)',
        'rgba(255, 255, 255, 0.5)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'r         g    b(   0,         251,       222     )',
        'r         g    ba(   0,         251,       222     )',
        'rgb(0,0,0,)',
        'rgb(0,0,)',
        'rgb(0,0,256)',
        'rgb()',
        'rgba(0,0,0)',
        'rgba(255,255,255,2)',
        'rgba(255,255,256,0.1)',
        'rgb(4,4,5%)',
        'rgba(5%,5%,5%)',
        'rgba(3,3,3%,.3)',
        'rgb(101%,101%,101%)',
        'rgba(3%,3%,101%,0.3)',
      ],
    });
  });
});
