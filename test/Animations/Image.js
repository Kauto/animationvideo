import ImageManager from '../../src/lib/ImageManager';
import Image from '../../src/lib/Animations/Image';
import {describe, it, beforeEach} from "mocha";
import {expect} from 'chai';

describe('Animations/Image', function () {
  before(() => {
    // ---
    // Keep in mind that you have to install node-canvas to run the tests
    // https://github.com/Automattic/node-canvas
    // ---
    global.window = {
      Image: require('canvas').Image
    };
  });

  after(() => {
    delete global.window;
  });




  const images = {
    "arrow": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAp1JREFUeNqEU21IU1EYfu7unW5Ty6aBszYs6MeUjGVYokHYyH5E1B9rZWFEFPQnAwmy6Hc/oqhfJsRKSSZGH1JIIX3MNCsqLTD9o1Oj6ebnnDfvvefezrnbdCHhCw/n433P8z7nPe/hBEEAtX0U7hc164uwuvVSXKwZLoOmaRDim+7m9vZa0WiEKSUFFpNpCWlmMyypqTDRuYn6t3k8vmQ2gRDCxs0t9fW45F52aBTROJLtZl7nEZad2m+KtoQCQ0FBARyOCGRZ/q92I1WgqqXlfdd95VsrK8/pChIEqqpCkiQsiCII0aBQZZoWl8lzFDwsFjMl0DBLY8Lj41hBwK4jSQrWOIphL6xYyhwJDWGo6wFSaH1Y3PTCAsITE1oyAa8flhWkbSiCLX8vun11eiGIpiJ/z2nYdx5HqLdVV7elrOzsuqysL3rmBIGiKPizKCHHWY4PLVeQbnXAdegqdhy+hu8dDTBnbqQJZJ1A7u+vz7RaiymWCZgCRSF6Edk8b9cx+B/W6WuVxPaZnyiqXoPpyUmVYvkKTIFClHigEieKjYuSvETUllaF4GAUM1NT6ooaJDKx+aDfC9fByxj90REb+9ppmIoAscH/6leg8MS9DJXPAM9xHCM443K57C6biMjcHDaVVCHw9RmCA2/RGC5C00AqXk/m4p20HZK4CM/J3Zk9n0ecMBhDQnJHcrTisyMfdQXOilrdMfxcwoHq/fg5R59TiQV3hYGKo6X2J/c7LyQIjOx9GXhOw/zoJ8wEevRGyp53o/lGMNYsBgPtEwLecwov7/jGDKa1twT6o3KpL4MdZgGsWZLtfPr7f1q58k1JNHy7YYaM+J+K3Y2PmAIbRavX66229hrGVvvL5uzsHDEUvUu+NT1my78CDAAMK1a8/QaZCgAAAABJRU5ErkJggg==",
    "chrome": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAB+FBMVEUAAAA/mUPidDHiLi5Cn0XkNTPmeUrkdUg/m0Q0pEfcpSbwaVdKskg+lUP4zA/iLi3msSHkOjVAmETdJSjtYFE/lkPnRj3sWUs8kkLeqCVIq0fxvhXqUkbVmSjwa1n1yBLepyX1xxP0xRXqUkboST9KukpHpUbuvRrzrhF/ljbwaljuZFM4jELaoSdLtElJrUj1xxP6zwzfqSU4i0HYnydMtUlIqUfywxb60AxZqEXaoifgMCXptR9MtklHpEY2iUHWnSjvvRr70QujkC+pUC/90glMuEnlOjVMt0j70QriLS1LtEnnRj3qUUXfIidOjsxAhcZFo0bjNDH0xxNLr0dIrUdmntVTkMoyfL8jcLBRuErhJyrgKyb4zA/5zg3tYFBBmUTmQTnhMinruBzvvhnxwxZ/st+Ktt5zp9hqota2vtK6y9FemNBblc9HiMiTtMbFtsM6gcPV2r6dwroseLrMrbQrdLGdyKoobKbo3Zh+ynrgVllZulTsXE3rV0pIqUf42UVUo0JyjEHoS0HmsiHRGR/lmRz/1hjqnxjvpRWfwtOhusaz0LRGf7FEfbDVmqHXlJeW0pbXq5bec3fX0nTnzmuJuWvhoFFhm0FtrziBsjaAaDCYWC+uSi6jQS3FsSfLJiTirCOkuCG1KiG+wSC+GBvgyhTszQ64Z77KAAAARXRSTlMAIQRDLyUgCwsE6ebm5ubg2dLR0byXl4FDQzU1NDEuLSUgC+vr6urq6ubb29vb2tra2tG8vLu7u7uXl5eXgYGBgYGBLiUALabIAAABsElEQVQoz12S9VPjQBxHt8VaOA6HE+AOzv1wd7pJk5I2adpCC7RUcHd3d3fXf5PvLkxheD++z+yb7GSRlwD/+Hj/APQCZWxM5M+goF+RMbHK594v+tPoiN1uHxkt+xzt9+R9wnRTZZQpXQ0T5uP1IQxToyOAZiQu5HEpjeA4SWIoksRxNiGC1tRZJ4LNxgHgnU5nJZBDvuDdl8lzQRBsQ+s9PZt7s7Pz8wsL39/DkIfZ4xlB2Gqsq62ta9oxVlVrNZpihFRpGO9fzQw1ms0NDWZz07iGkJmIFH8xxkc3a/WWlubmFkv9AB2SEpDvKxbjidN2faseaNV3zoHXvv7wMODJdkOHAegweAfFPx4G67KluxzottCU9n8CUqXzcIQdXOytAHqXxomvykhEKN9EFutG22p//0rbNvHVxiJywa8yS2KDfV1dfbu31H8jF1RHiTKtWYeHxUvq3bn0pyjCRaiRU6aDO+gb3aEfEeVNsDgm8zzLy9egPa7Qt8TSJdwhjplk06HH43ZNJ3s91KKCHQ5x4sw1fRGYDZ0n1L4FKb9/BP5JLYxToheoFCVxz57PPS8UhhEpLBVeAAAAAElFTkSuQmCC',
    "opera": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABSlBMVEUAAAD28vKlEh7XGyusHSwRAALNEyT2Q0ytFSMyBAh0CBLICx/MKjafDhu9FiaaDhu5EyS6GyqnFSTfIzOiEyJ8CxVuChPNDyLHEiPXJTHpO0TTIy/WKDSuCBvHCh6jCBm8Dx/HDiH2Q0zcOEGLBxXFDiDoND/zPkjQKDSpDRy/CR2lDRtsBxG/EyPqNEDEHy69FSZJBgziJjWNDhmWFiKxEyEFAQGdFyfLFSUAAADYJjLPHyzLHivkMz7GGyjhMTzTKDPgO0TcMj3BGie3Cx24EyHYMDvTKDTWMz23FiPEEiPoNECyFSLiMDzBESLNLDjBEyPpMz/YKTXLIzDsNUHVJjPEHiy/HSzBGSf2Q0vZGSrVEyX6SVDRCyDyPkfmLTniJjPsNEDkKjbcHy3fIjDpMTzvOkPSDyPdJDHaHi3uOUPqNkDpMz3RGChOcHzdAAAAWXRSTlMAA0EdCQj+51IyDf2ZgHNvZWAzKiAeFP37+vn27ejl4+Lc2dTSz8C7t7GwopmFhIR5PDEwKSkjFhQT/Pfv6ejf393c3NrYzsnExLmzs6+moZqRjol8e3dvNh6lMQMAAAFLSURBVCjPXZDVdsJAFEUnAqG4W3F3irbU3d1pcRq8///aezMka9H9MufcPcmaGaLAczYbx5P/lAvJiCBEkq/llTH3JLSWCIUtomBLNFutZlSvP8L1hlP2J5rAZZUQaxTTnfzNcweaV0MYhli8EDtvdP651wHONxkQ9mPMBzVJvMxHo9HsgTAAn5pBmb/jXHvRBxZFSRB9H0nhfWq+hSiK3Q8qil0ROLSDYD1doGemYmOAzWcFodkeABMLFcYetnUWhacHKGKCTRLszg8wlX81xLZbAVHdHwJTIxX5KbYTBx736gvJU/EolVsVAQy/mO8ZhL/GrDYRpBL6BuL0ScKYzxxEwqCGopYe0YzRbSIUZ9o1Ho/jVoZhwxBcWS1Z4kjr2u12IJMJwOLOOomC0xAChehOTbhfQVXKxYJ+fzCWK8FJV0yjvgbUG/L8D1M7VvyP2ng5AAAAAElFTkSuQmCC'
  };
  let image, sprite;

  beforeEach((done) => {
    sprite = {
      image: {src: null}
    };

    image = new Image(['arrow', 'chrome', 'opera'], 25);

    ImageManager.reset().add(images, done);
  });

  it('should change the image', function test_image() {
    image.run(sprite, 0);
    expect(sprite.image).to.equal(ImageManager.Images.arrow);
    image.run(sprite, 24);
    expect(sprite.image).to.equal(ImageManager.Images.arrow);
    image.run(sprite, 25);
    expect(sprite.image).to.equal(ImageManager.Images.chrome);
    image.run(sprite, 49);
    expect(sprite.image).to.equal(ImageManager.Images.chrome);
    image.run(sprite, 50);
    expect(sprite.image).to.equal(ImageManager.Images.opera);
  });

  it('should still run 25ms after last animation', function test_image() {
    let timeLeft = image.run(sprite, 50);
    expect(timeLeft).to.equal(-25);
  });

});