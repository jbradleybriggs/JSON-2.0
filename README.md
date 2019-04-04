# JSON-2.0

### Usage
```js
// NOTE** key names and string values don't need to be in quotes.
var json2 = new JSON2("{name: Bob Roberts, age: 25, favourite foods: [key lime pie, lemon curry]}") ;
```
This produces the following object:
```php
{
        name: Bob Roberts,
        age: 25,
        favourite foods: 
        {
                0: key lime pie,
                1: lemon curry
        }
}
```

### In-line scripting
```js
// The JSON2 can be constructed with an additional parameter which specifies whether
// the script will be evaluated when parsing or not. 
// Scripts must be written between tildes "~"
// the insert() function can be used to affect the JSON instance directly in the script.
var json2 = new JSON2("{OS Info~var os=require('os'); insert(os.cpus());~}", true) ;
```
This produces the following object:
```php
{
        OS Info: 
        {
                0: 
                {
                        model: Intel(R) Core(TM) i7-4720HQ CPU @ 2.60GHz,
                        speed: 2838,
                        times: 
                        {
                                user: 20586600,
                                nice: 94200,
                                sys: 6722500,
                                idle: 431657200,
                                irq: 0
                        }
                },
                1: 
                {
                        model: Intel(R) Core(TM) i7-4720HQ CPU @ 2.60GHz,
                        speed: 2423,
                        times: 
                        {
                                user: 13725000,
                                nice: 43800,
                                sys: 4474000,
                                idle: 146182300,
                                irq: 0
                        }
                },
                2: 
                {
                        model: Intel(R) Core(TM) i7-4720HQ CPU @ 2.60GHz,
                        speed: 2646,
                        times: 
                        {
                                user: 20480700,
                                nice: 82600,
                                sys: 6764100,
                                idle: 137540100,
                                irq: 0
                        }
                },
                3: 
                {
                        model: Intel(R) Core(TM) i7-4720HQ CPU @ 2.60GHz,
                        speed: 2865,
                        times: 
                        {
                                user: 13568000,
                                nice: 52100,
                                sys: 4479100,
                                idle: 147212900,
                                irq: 0
                        }
                },
                4: 
                {
                        model: Intel(R) Core(TM) i7-4720HQ CPU @ 2.60GHz,
                        speed: 2473,
                        times: 
                        {
                                user: 20332700,
                                nice: 67200,
                                sys: 6745200,
                                idle: 137559400,
                                irq: 0
                        }
                },
                5: 
                {
                        model: Intel(R) Core(TM) i7-4720HQ CPU @ 2.60GHz,
                        speed: 2604,
                        times: 
                        {
                                user: 14142600,
                                nice: 57400,
                                sys: 4722700,
                                idle: 146030100,
                                irq: 0
                        }
                },
                6: 
                {
                        model: Intel(R) Core(TM) i7-4720HQ CPU @ 2.60GHz,
                        speed: 2599,
                        times: 
                        {
                                user: 21012900,
                                nice: 142500,
                                sys: 6935300,
                                idle: 136962500,
                                irq: 0
                        }
                },
                7: 
                {
                        model: Intel(R) Core(TM) i7-4720HQ CPU @ 2.60GHz,
                        speed: 2772,
                        times: 
                        {
                                user: 13971900,
                                nice: 36700,
                                sys: 4353200,
                                idle: 147536800,
                                irq: 0
                        }
                }
        }
}
```
```js
// Alternatively you can use the insertKeyValue() function to specify the key as well:
var json2 = new JSON2("{OS Info~var os=require('os'); insertKeyValue('platform', os.platform()); insertKeyValue('release',os.release());~}", true) ;
```
This produces the following:
```php
{
        OS Info: 
        {
                platform: linux,
                release: 4.15.0-46-generic
        }
}
```
