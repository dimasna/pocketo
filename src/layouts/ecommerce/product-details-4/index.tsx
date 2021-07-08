import React, {useCallback} from 'react';
import { Image, ImageProps, ImageSourcePropType, ListRenderItemInfo, ScrollView, View, ViewProps, TouchableOpacity } from 'react-native';
import { Button,Modal,ListItem,Tooltip, Card, Icon, List, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { ImageOverlay } from './extra/image-overlay.component';
import { Product, ProductOption } from './extra/data';
import QRCode from 'react-native-qrcode-svg';
import { MessageCircleIcon, PersonAddIcon, PinIcon } from '../../social/profile-6/extra/icons';
const product: Product = Product.centralParkApartment();

let base64Logo = 'data:image/svg;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAACACAYAAADnCyxOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACCSSURBVHgB7V3ZjybXVT+numf1Ns7YEy9xPMZSEiNFGcfJCzxgR+KVEIEikjxgSzyTBIUXIjE2EgkQIdsPCAkkbEuQpygZ4A/IjLKhIMxYAZxEWXockdjGY/fE9iy91KGq7ll+51b1uL/unume8ZxRf199VbfuPfcsv3PuUjVE1+gaXaNrdI2u0TW6RtfoyiOmtznJfz5+gPauHKG55qMkcriTyIFyhU/SipzgX/3cMdpGetsqaFDM/pXPEDef7hRzYO2SvND9Pcrv/aNnaBvobaeg9StmRCepnfsY3/fZBbqM9LZR0CYUA9R509nmfr7/s4t0mWiernIKxbSdYvhApxzaOHUx6rrVr3UHD9FloqvWg7bGY9agVh7i+/74OF0Guuo8aGs9Zg2a46Pd53G6DHTVeNAl9Zgp2kWH+Vc+d4ouMTV0FZA8/9cP03XtTzt7O3pZlNPTMj1Il4GuaIgbFNPQ0SF4XwIkuzjxYboMdEUqKCnmKqcrSkE7WTHyLw/sJzr3wW4w++7Ou/br2bPUNi/Q+fnv8yf/4xXaAF0RScKOVMzq0l/Rj/7xXweFSPtAlzHectHyLX+TlnZ/bVZF7WgF7SjFtCtE5093ycGbnaN03+f+7zk6+/JzM9VB/ArJyj/x7zz/7LrvoB1IO0IxtUJWL+TrS7/cgIKUVub+nj/+3DfXU3RHxaBtVcxbKWQraX71U/LlB9YVl3aEgrZFMZdTIWPaT3uX/qD7/ou3KritCrqsiukVsnSG6IL+9YrZVpL75Cvvfx//7ve+f7FS26Igef5LDw7zWSIP0qWiHaeQCZpf/WD3uXMUFIrppkm2euR/JSikppYf6D6/fLEil0VBl0QxV6JCRmQD2rXpkipoSxVzVShkRNujoC1RTK+QXgl9pnX1KGRm2lIFbUoxqJClN4u3XKOtUdCGFHNNIeuiTSloJsVcU8iGaEMKWpdirilkS2gmBV1UMdcUckloXQqaVIwpBNNeWaFrtLU0udwgXzvSb7z4fVodNkYc6ZRyeChqyqm++51NPFQl3XEpx/2HDJ/E+j0UFM51aLny2777j0bL23nx60N7zH69tA/VDW1S4UXrZ23e20v94Ml+jXnVY+RpaIz7vXLdofU9yglF2Z4L3wXW/94lr8lyc4IaPjZ/9FuTe79HCpKvHPltmqN/oJZudka0QmfYmNfWBJlSZnrh9EIcihhXggpYQ+FDXU2vahAG1O280EQd+bc1ywRGNPBGKizxOgcjQj69khC60IRRGI+qpMSDVdG3JrWBhPyGI+GF7uCx+T/LikrbruSrR57oznx1UI53DRTClIWmChisefAZVp70WyQrp7/CJqj4to5EnyZO+kXs4Ohi+ScCjEoIGDYxumjIikgRstXjRhDNEpwrRbXf5s3MFeflumJL+cWN89XLLWQg93QKfmr587/2KPbIFdTB2qNd2T8MLivnUjMUb14mLF/csphRufbBWtRqaasG6nt4fI05n8bicEqUB7Y2J5TpMOmGp2Jldv5HEDPRIEv0jeubQJqliaJI42vQD5vZdtjRNEdXP//rj6fbO+U83H09laHK7gZoQ3eWUIagN4ysLqClnIu4QFVsifNQT7peYIgxFqHAEt9EGebUjlvK9U/wHZID71f+RNjrMy9DJBh4Eqim9dJ+b26DwHoGmCwabJuPzX/xG8dMQT+lPhEYail+WgRB4SjCYSNSCyUHPxRo/M5BkiV0kusEoaQ21hAc3JKSERA8Q9Xep1pBdf3JIJqwNkh8gj/xOOPVQF1oULWMhjjdmsJbAZxcnHtz1z1z6j0PexR0izP+GSArLMADLQXS2q/k4Y5I7L+jEhASaUcot0PeNpbVP8YzrKeMB/1mvI+SwmpeM0/kvYrbGe4KJZqMEAhYcn3YUolD0YbDUAnqolLaS7tWXmy6ix9NVXFm0JmwQoJ9kCR8qbvrVhORIQVfk57BH9yH35htuSVPkECMFInvLHNVp8mlrgQUMe6LOM/JsRMaqFfoN5YPmBdoTpn20K+cDYY092Cj0EZwP6F1ioO5V+g2bEwWwZh+maTqdqSvlc0i9kIHR0JKhqWGAPBKcdbbsCyLGa+joXESav6u1aZ9s6RCj1n74CjBFo8EEkIwLuxSGDUrRro7mJu3JEd6D/qAWjpjZ7Jr1hBDAG3k8McuNYNFSmSWNTLQhAcyFhJ02Iwt7sjmUNoIHiyWCtQpa3hgxVQFwdF+OkZmUt2cPMXOMd6r8Usr0RCpEavcergxCWSx6z2qSaqZyn7gtUWGg2VNgTKGMPw94b0jEgljqBsxc5FcLQG/BjNjkEICfGAZ8ek9b4VihEMB3RJmEKYt2UM9vfX4VavYO9gM9cho0BLAmuKDYFcpwjOeoxEmo1e50sfGFYIZmWl4cpqZoBAnpcFplGP2TjuvLjqZsgShnIlSxateBwNxFBnZFnu78dkfNJThVuLA2xzkIE2+E/sYdpYdKUMPMmOC8NkCL8ZQXNPRMWrmH5K+YDyTzBQEgH/GdFEU3isI3x4aMFYxrZFqYiAHx+XKDs1cOd9DYLgEsx3lno4axhlDY6yBH5I6KGFzcQoFDV0QqW2ksMiU4STLHotS9h6mif45o1grQf2YxRmjFgvNadHbw0FayC6FxiAVJRNMiqTxovMiGdrU92v3AnToqxFXlHuce5AoN4iNRNkgSSphxUUcp3DwBTxkpddMRnbEVPUW0FRopFoB8PCpmRhP5WQC+aokZbManK+FL3JtY95mjSyQsCon4sdU3atNWn46aFvaVuxMPwWUPcg6JNAYjKpzPDCrpZStuBULoTHSaILTvYZSCj26ns5z5TXwqYoWABgB609pDVcIy5TbJh591VA7xklOExzcWucDWzjBtB8xq/+IYm0ZVZQ+zQMH6oUZDDIJpVij5xiYEAb1QRCGIUSurzu/stTSmRffoAtnl4uskyFUza/3t0Q/jObmGtq9dzfNzze077p9NDffAOpLMAnGE/yXa1yl1cmgmGJZoeGYzqIJFFfjL9rQgR5bSmPDaRJdUe2rbFhIko1mDhj+4pwLHoUqhr3iciqJj67zKK0st/SL75+ml37yGm0H7b9+b6eoPXTg4I3DX+Eb4Rj7K1ndYgsIcc7jtQhkm4g8Yfq2vKHGIdx08vf1JMWFzqfm9XLvZmP07b9arUzIA2NUEs0F4FcKBkvugzEDFCw8+wtafHH7NiSefeP88Hf6pTOdZ+2iG27aT7e/+xDt2b17sj/Y/wEphBLkSqWIiNEU2aRQGKmUKVYpKAcaZFfyfAEiLuXEFcPu6uq26DiD7XC50xQn8G3xADNBO7Lrr7xwZluVU9PS+WU6ff4MvX7mLN1y6Ga6/V235gIOGgp1Aksf5QKsL2kZ0siBNmvFW68WQ7oG5OKKvdQaH6SKwR7HjE2CNWsgHBs9DmKlmVqKU8mzupM7STlIvaJ+/sLL9PxzP6YLF5ZoCvFDV7EYKHaxjmOCvqRIZF5CkAAJWDORB8ZG5R+xrE61vQYjzcy1nCmrmnhQj7KEIpixILvUJwQ7mM6+eZ5++F8LRUlIhiiT48QiF8FBPke6z2D/VeAmn321NXut08ZBNsoIrbjKMFiSp9HsTKiiONohioqCGdJkobSyurxKO52WLizTD/+7U9L5pZR5aUcj+xOUMYOHANqAl422Awgcaz06hxrjoGFcBHgaxKmGoip2F46lX21eXcm8lokoDXwRI64A6pX0kx/8jNqVVYAlJtCBL22YV+CMdk84xRZGahFl3CbW3RBRvns0YLH9XuFJuP7jwX+qJaKJ89NM7WQ6e/Y8vfTiqwmWHCeScsjnG1PIRY8xpZbSY++hVLHOZqM3YkV64HCVDCPWO+r5MrcoBGdg5grTz0Avv3iaLiz18QjhCcY7ASp2kTwACOxeUjtPq8SULjMqeJ5YXaSXagsSlMpNiXxZCddBvMXgM77hGk7tywYh7p7330bIvGDQFIDiDABdDFnuxjsX6Fz318eTjdBqB3Ev/+JVuuvu21JfDIrcK5wFnJuOuBysRXol4jVZx7xr8+JLJpi4Y6dzdZSgLeuSaeKkxSqeWmGcjQ7eeSD4ElC/IART2SVjVlrt4jz3+gV66X9fpdMvzv5e2NOvLNIddx7qpozmaBRHHTXId5i6bkBpaNCBdvo7Nr2yTszZxkXDLGKpPAc56F21yF4gS7MNGHGfzUflFHRzynFKcSC4MLPBNH+U7HTn9l2/hw6/9w6669530qzUe1Efj6w6bRJCuFBsTFQeU6IEyuHoBYDMUIi1O20n78bmzrQ/kjMSYCKNmpXHaqY5fnAah6UObYJM6KEizRjNGGh6LwROSxmPh+482CnpNpqVFl/7JdUYitDm+y48NGAcNp5hWshd3fvGokOn/q/syHO+Oba6MMYZ1LgRAyoawjAgzfSmic1oCpcFAiTsVCzYoSyw5YjQBT56Je3Zs4tmoTdeP5tqszVPMwEfcsB4UFJ84pzV5Z5ZOR9tNWRqYzXH5BVTToABsoEZipKtmCdjMhH1idrD5tyJIVNSu0hwusZddosaWzvw0itpFvIkQwp8EWRo7P/CKSZsRcvqeYlluLgYM7WxYCe4h4WTF0hqILtqXvPjlDB4GBeqaqjZnZ0EDiyvYVlL9biHAOJTJ4frb3rLVxUkWl1dHWKRVzYYacUTgdFoMeQ8D1wlJaMKBS6kMlDF7WqS1cHDDhShnNqy1+XRgAmYkYy9k4Fho8Q5nU8zx8YzUb0xzO5N1N23Z+9sENfTiimIc3uMA/hWp9QQkdQxfDqsnPNRCzvssBZihTjtd8JWAPKSqSmUpf0HAHrmOa5qFIoQmMAmKfm5H9lio8Wgt/RSvTykzLNSmkvTRMXDg/2Requ4UhjPYT3lOiBY5KI21TPkb9aIzbpG94dlWcqoOo5OdhV3oeXrE1iwAUq+ARmaT01aH1JbGRlcWpuxGTA6y4YN2tFo3fCrpCk/UFYqg5A+UIO2FpOgRBlY60nSsFKB6yiLGAnAyczv7DTSr47B0vyhYryEx3OybEkVbmhW3TI1Uhk4O8YHpywuGUewSTiU4bJcKr7hXvFxWLBjezQOK6qmxDPskc+3rSlrpkpFvGnPMRZyTsoRi4YCoQSz5gLtAte9yLDuMyvt3rO7UoAx5xE56YGwJONxll7e2Fbyal8PgguRy1s+XyOVtswVA4x1a3Y1rcDN4EqIH7bMpivFs+JJIVKInjKQfj/CLLT/un0OX5UTuJPWSktoItVFMQyiEmI0Zmk9ElM9jLFLO6W4SpIDMkG2YkoKuCPHYldgLZhNeJLZiwBkxDwfxMJaEF44zvaTqKdfnm1ObvfuXckZ3HFF0nQmas8Fr3fFLItna0OxMPhSWc9t5NBiRheVsUtEa4SgZ/FI4leFillgW0VgYCkrsrGdn7e46FmUFS71rKy09OP/+RnNStffcN0IZxmPJETGgD7IXxrJROwA8GMP+fXebHbPSRIR9RogKfWkXZKVB1KAMpwn2owLGec+LyeS5yGZpvHfYzcPnvPD7y3QuQ3En5tvvpHCBMpnwFfZjyCtuCFhBjewaYrLMuCpnvaYN08RP5lAxCr/kDFTelzGFI9rQw53A3ecvUhSVzZNtm6POz15BMnKW8f48rJ0Sw3nupizOHPcMerjz+5+7s7bC2dyp3AJmqdI8KvX8wyLcS4xawboPU8Gbv1BKzqCAK3Yp2msNVCzQSEqIBoMc6HECG0C+n7w3RfWvCaZWz+5pBs++u1Um6VD7zzocd1eSDFITh+1t+75pg8r52l/1W+waADNQQmtamueHJu46ugEWVYnktx3OErnCWEVK6C08jkjvf7aWdou2tOl1u+45abhGAHOoCXQJRaohXBGH+F9pCgOYxaGuD7si3vN/CsCLMfKw1CnoW0Kh+WI82ppjOGnFFHh5BVE77nvHsLdTCPEqGQkdYgBqBsHSYglNkgteeFiv2nkjN0YdUqsBOpNRatCVFnEUFdbMWeub8qqdXKF6ej2dx3q0uv5LHU26C9DDt817WkagQxleNphkExK4UpF7GMhUVjUnJhpsfegRRJQMamgIWeewnd0VPPOwoBFKL2WCoqlMXSlUK+cO+4o+7QFp3JQzhbURTy7LOowrUEcB5yKuzTFhgESl+zmVO9BC+ETY8EJ3CLZqcdoCoxGJpWt7kpynzt65dx5KwV4E6RurF7DDvM4jDCxD1+uTIxD9aElWzK8rseWtvokYUHTU/VGCawVUICEAg3u3FMcPu26WpBlN2sxt0OpXwa/+9530Q03Xjf8tnUemzaienJWNZFm78GCDcD8WjbrHLRKmC6ZgvDJ+W6oukCrAGIcejI+GBlxtnj8GgG4Sar2E4OyM5U0Pz9Ht952kN55+0Fq5uB9Opz76gmRGqYpB54cgXQbsz1ayz5FF4T6Me7gm32xllYW5mmVTmn0L+0IY/yLOoWIJ2TtAzMqECjwm4xBK7dDneeGm66jA++4gQ7eevPwmGTiMx1HJgYG7/2MHVKa2bYhl+lhR+CLzW4OBt6WKnY1850HzdHxTkmcEgDJVQ3HTZnCgBDmHdD8BM5XO3pkgq1tIFve3nfd3mHJYH//+OM7buqUwsF7SxexdNv7gD0Izyldt/Bgme0aZPG6LFaLzrzYev4wvKVzc8/N88dOLspXjix05w9H4szmsb7qgTO1+K63gMG4m5DRxNDmFPOh33wf/FKeYJepZ4hmrW1IIfGR+IKMzIzceBUIIqNgjhVS9ThkVRWcLbtHSzI+oForLj7W6bGmRL1T/MTxRXvTyPHhdpctazouwBZraq7eQpnPvB+sVgRvidOIDg+S8EpPC4eWYYEFR9sCStCMK70KRkYs+2SkTk9XG8m0uojQI36JIrHQSjNigtXKsKmgzLOUodHJ/rQt2J00fgRMf3g8HFiKp+rqZrFfMuqnC8exeGNkT7bFQl3UWVurGZQyTq5AtjpodEd0CLyPAgnMAHxZmkL3LgOIwaW4WgVj5VokLmr3VN69sho+1p8sCpqjfyZOM3YKp9YbtBAOA2ULgoEsMuU96efGXSkvipovM1ULUSpTodGsh/eJQtCpAfJr0SGVoSrVBqu+MRFk705XVWcq4NAY9oMhVoilCu2KDP8F6KCgLg4tdJ+nQA2WbJe6xSwCOkfGtwVDtNbgID0bs0li4EIcQCRjjrvShCEAv2qolRIBNgl3/aE3GidF2XaX/0nVDlJbrILdmw2tLJB7jQu7v/RtgLihYTlWmpbkLANbDbvWzQrNmpNFNhgftArYerdpkhBZEENb45jCo/Pj+6BnZFt5Gf6s81yVFxjAMroRZSP1p8HN7t2oMgQDHbeDUNBKB3ODemCYLO5IbA0h1jLA6XCqFbMM6IqxBsrbaBxyI1b8RyPhal+C4q4Jcc0Kk2dYIzmoM7Rd95kIBU4ul5FJCEQzZHOkmy7icPO0HcdDxJ84ebxj5yT70ndKXrWyFuqXjNE0bgh9XzajGKxPD9jrLHyJJAlRPVYr/IHwHYonJKT3xNyJVI4Li9CkgAcOVPs5cgYniw8lnvphWLvAX/zGCSuW/muArtwx7yDYTEkgqo6Y21qMU0ZRByNo8exno5AX9wqjYADmCDNMVAKtDZEjw8HFeiYavSO7Dnp4J4UmwrJpujNhvRrtu2jCj2KhrKB5erIrtah3kO/ckQhfyMkgDGjc/XdCBoTXNqofzH0Qfvxc4oLS5GZdBc5b2XhnVJeVyCCZ34mt7VW611lswZScyMc6ovWI8jfMJvRCX25XTyAfSUH9rEJX+JnCf0E53H8mzoiBn8GJxoXIvZUdydiednXOriVvkyC1p1qYDDxWHoTNYvaG6MCVygG6IjRFPmlS4pQYmUzKacbpFSnTnWxStEWkwQXo6X1/+W8LwEDlQQPj7TOSnlUNKBlEzDYTRPrsboX9Nblx1rFq0u0vSiCfaJJUSYIKrOoexSOwakxqzAJV+xb8zVshBBIss3mSMnwJ5emu8h0YwhG+Va5l43XvPbL6GFU0UhB//OTJrvhxs4IK2PyMYGetFIyBRqpyk5eN6AY44OSZ6EFcxcisFORF4A/rzmX8nTxcXxaKaSXxfo+q0+mb5OWwecM8bNBxM/aensYeNFRMjwwO2DqMS4BdqAb7pV4KXagK+PHs0BZ1YvZUQS8RIRyntpimE5ZxA+MyzK6jcawHzzK5W5MSiSsLTEdMtyXLq2Pv6WlaQZ/oZhaYnyjtihmMQia8+0/dJpZ3MUpSPp4YRM5OtvPI9ynbaWUH4ohZvxWppVvxKqmi0opRTqrJfwnFdJEETBbkhwkDr6bUzdEGSVOqeWbKe3qaVNBAu9teo4sM/lEATgzYPJM3mCPP6tyuEm9ru9X6yQFDUFml3yMlTMZEHPWDh5H3iqaSClRg8V+Bl8RSODSXSc/YqcPDb5WaPiWnjzsWnzo1FXuM1lRQn9F1tT2WuqzOxLHrFv5LASui6Ys/XKxwJAg/TBvxophSsV2t4lmbL7cT5YxqaBPaFhCzx6jCX3L6FKM0duoDwxo2fAwIgCJlP4EUDyrMJFvUzSAs4UuPruU9Pa3tQX0tv3fyiY6N49Y3swOJ/US2hztLO1lzfancOjc/27OhffmypK4ehMmJWbml4DWw1B4zGWuaVJeJ3GO6JjhsiZdIRkK1S69TbGnTlIuoU6ibGTsx/8VvPUMXoYsqSFt6pDOHM0XmsRpfQo6GZpnAqzVCjnX4wG030Cx086HryaSAKlIcyY1BTB4F9joNT7MMxrsmBySTQGwTpDreEhO8ZtD+NgDx8OV8I+AsrrSrj9Bb0FsqqE8YulofE19h9TbM4MSGDOWG8hZox2WJDiPdcteNw3ur10uH3n1QnYEhWGMQILIBpF6kiFW1mDkUgul4pKz+S4ipXkFWCYivO3sYqtDCTVdytlD4vCi0Ga1LQvzJZzuoI83qcm+llrxmee5XPvaRZKX9a5DveM8ttB66495baP8NeyIkuGztf9ehKriHCkeD0Mn0GhIbkXg/aA97TEnBPu4gWwHNLVoGwRoWyUDGmaf+VddPzH3hm0/SOohpnSRPHTlAu/nrnd0csTRAN5KI+FtURfIbVYnQxf03DN1O/+wM/fxHp8tb5yvq3xB/+7230jvvuhmgvIojWr/4YzEW4DEyE40ySCzjdXHiLfFaBCyuFBU8+cxyz0P//E7DOvIo82u+GNR/DI+iLMz/+bfuoXXSuhU08PTUkcO9krrb7jZji85bWI3opNc4IIWzoMJo6Y1Xz9G5X56nleXVYQPhvhv3Dm+GH2DQlCAG5LGj1bBWEKZUIPYuIb8uE3yoYfPIoIQsQ4v7wU5qw+t/tXiNcAdPqaOVheWV9qH1QBv0ZjYalLSrebY7PCA2KyclrwxmzZOsAyLsAk4WaKX9DSW+lA3xa1gIVGGZgLkS8ED+f5ZSUmAwr93V/w0zXa8VXM75dFwRMIHg3BAUTSK7ywbpBrG4vLx6/yzK6Wn9UdoYe6SfZZj7SHe4aFat+1Zt/4a7vc1zWG+dpKozHXPeUmxBj8kHpJbeSh1zhvOg9bpyc1eLi/V19TyY1GLDckQ+xvUHnAhVyFeeh/GQxsnFDv0emlU5Pc2soIGnT/37yUFJIouMnbXrlrqUTy6WpeIdhv42ro40zHNVv9FTM/KTQgHnpEkCcxX3q4mZGrpG9YILlq1vYqiASYcLvPTIY66NNCw2FkeCJELa19pVeWj3F8omkFlpQwoaWO6UxHNzD3UMLuqEImt/q0g7dCNwuIhg6EHrwwkJMKza8eyHLem184ZAFgyL8NfEbOa1zov+/xZRSM2HUXW9wC2ltmkG1jJMbH3g3P3F1YY+slHlWMOboiEmzTVf76o6jNmqVq4WphCoIwcfTY0CM1UxQ788ESidL9MX8TJBw6Ki4SnPoRz8zVRE/V+TnbWyRODXkwC2mdJWcmanPe8KLSydbzcEa0gb9iBnpY9Jq+1Dffpo4KMe7iOh/hzOgifYV1QLNAlIN8jRC3pZHbCCVfdB1paRx6R2RaDCD9kQoS/QsJ0lhS/TSHFVgWAnOi+seJf2VHbKO7lEm1eO8r51JE9/6PGOu0876rgVOmRHfGqhbR1PgDDYirPe75OhYdGS29DkZOQ56ils2SZxlam5OodRSqtxxLLBlpLq7X+rdzw287EAyvxkI7se48eOz/7e5wnaUgX1JE998DOdDI527B4ISCmXMMUWE6dCIDlElfP6Bmji+oXoFgT0LV3lNamckrLy3uwYN3kMu+hAuuig7C8ImJOqbE6lHR76u7r5Snl07uh31jVDsF7acgX1NMQlmn+qO3xw4L7VVM/GSsz+QoxyQ/IuGBdZ5uqeZUeMXoRCM+VNxEKtHGJMAJ9mbE2ZHXFvVDNyxaldSQyUyzk5sSzyyL7HNg9pNV0SBRl13vRwJ6yjXM886OXyqd4jMUMMUWgkWEsGeJRUOEDa8D0SPG3NFNmXbGymSoKPlHQQvNFY0FDYhnfFa2jrvQbpkiqop8Gb2rmjXWceVos0OCnCsaRMrXI05VKycPIYBTGjjjcRl6BbYrMY9jvHKTCI8qZmJn0tP9nolANa1bOGx7CpizV7tizWrEWXXEFGrqiWH8Z32URqK55Z+RDS/k9CW4fSrAszJn0OVOUJsGRC9XjmI61ROyQUMLZGAjFQeXb0xPLKpYGzKbpsCjIaFLU6d7TtFUWR7g4A0zKm4Z4AmBeJJ/AGSwabCn+WPHjMscSgzEX1k80NQFe0kb3P44u1MezNoKebdvVp/tPvPkeXkS67gozkb4cB7oMic0e7n4d76QxxoaXsRWLuxjTK8MDqU4Y3wBBRrEUNZQdNhdK1+ta3WNAoyyQ+2d1wrFne++SlhrK1aNsUhCR/9+HfoLZ9WKRTWKcsmy4Rz9oE1GNjJqE8zpICVrghITK9wf0G/1CYxAyyfIvof515qrt2rBsTHeM/+c4J2mbaEQpCkr/58JFVoiNzRL/Vye7+7tTdtkUGx06WqVlm6BGmZRsCTSQD4ZcUcPnTfvMGN3KyaeaO8ee+fYp2EO04BdUkj3cruXv2faBdvXCEZO5wF0M+sFqC0eHu6oHOJw5YIoFJACinm3Gn16htzrTSLnQetNCtrC00vGuB3th9Yruga730/xnmsntljPtdAAAAAElFTkSuQmCC'

export default ({ route, idWallet }): React.ReactElement => {

  const { name,id, type, imageUrl, balance,targetSaving,currSaving, currExpense,budget, budgetPeriod, details, totalIn, totalOut} = route.params.pocket;

  const styles = useStyleSheet(themedStyles);

  const [visible, setVisible] = React.useState(false);
  const [visibleQR, setVisibleQR] = React.useState(false);

  const data = new Array(8).fill({
    title: 'Title for Item',
    description: 'Description for Item',
  });
  
  const renderItemAccessory = (props) => (
    <Text
    style={{color: 'green'}}
        category='s1'>
        +$10,000
      </Text>
  );

  const renderItemIcon = (props) => (
    <Icon fill='green' {...props} name='arrow-upward-outline'/>
  );

  const renderItem = ({ item, index }) => (
    <ListItem
    style={{marginBottom: 5}}
      title={`Salary ${index + 1}`}
      description={`08 June, 2021, 14:58`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  );

  const renderImageItem = (info: ListRenderItemInfo<ImageSourcePropType>): React.ReactElement => (
    <ImageOverlay
      style={styles.imageItem}
      source={info.item}
    />
  );
  const renderCardServices = (info: ListRenderItemInfo<ImageSourcePropType>): React.ReactElement => (
    <Card style={{marginRight: 5}} header={(props) => renderImageItem(info)}
    
    >
     <Text style={{marginLeft: -15}}>GrabFood</Text>
    </Card>
  );

  const printQR = useCallback(() => setVisibleQR(true),[visibleQR]);

  const onTooltip = useCallback(() => setVisible(false),[visible]);

  const renderOptionItemIcon = (props: Partial<ImageProps>, icon: string): React.ReactElement => (
    <Icon {...props} name={icon} />
  );



  const renderBookingFooter = (props: ViewProps): React.ReactElement => (
    <View {...props}>
      <Text
        category='s1'>
        Details
      </Text>
      <Text
        style={{marginTop: 4}}
        appearance='hint'
        category='p2'>
        {details}
      </Text>
      {/* <View style={styles.detailsList}>
        {product.details.map(renderDetailItem)}
      </View>
      <View style={styles.optionList}>
        {product.options.map(renderOptionItem)}
      </View> */}
    </View>
  );

  const renderGetCardButton = () => {
    if(type == 'Expense'){
      return (
      <Button style={{ marginHorizontal: 2, height: 40 }} appearance='outline' status='primary' size="tiny" >
            Get Card
          </Button>)
    }else if (type == 'Business'){
      return (
        <Button style={{ marginHorizontal: 2, height: 40 }} onPress={printQR} appearance='outline' status='primary' size="tiny" >
        Print QR
      </Button>)
    }else{
      return (
        <TouchableOpacity style={{ marginHorizontal: 2, justifyContent: 'center' }} onPress={()=> setVisible(true)}>
        <Button style={{height: 40}}  appearance='outline' status='primary' size="tiny" disabled >
              Get Card
            </Button>
            </TouchableOpacity>)
    }
    
  };

  return (
    <ScrollView style={styles.container}>
      <ImageOverlay
        style={styles.image}
        source={imageUrl ? {uri: imageUrl} : require('./assets/nopocketimage.png')}
      />
      <Card
        style={styles.bookingCard}
        appearance='filled'
        disabled={true}
        footer={renderBookingFooter}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'column', flex: 3 }}>
            <Text
              style={styles.title}
              category='h6'>
              {name}
            </Text>
            <Text

              appearance='hint'
              category='p2'>
              {type} Pocket
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 
        'flex-end',maxHeight: 40}}>
          <Tooltip
      anchor={renderGetCardButton}
      visible={visible}
      onBackdropPress={onTooltip}>
     💳 Card only for Expense pocket
    </Tooltip>
          <Button style={{ marginRight: -4, justifyContent:'flex-end' }} appearance='ghost' status='primary' size="tiny">
            Edit
          </Button>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text
              style={styles.rentLabel}
              appearance='hint'
              category='p2'>
              Balance
            </Text>
            <Text
              style={styles.priceLabel}
              category='h6'>
              ${balance}
              {/* <Text>{product.price.formattedScale}</Text> */}
            </Text>
          </View>

          <View>
            <Text
              style={styles.rentLabel}
              appearance='hint'
              category='p2'>
              {type == 'Expense' ? budgetPeriod == 1 ? 'Daily Budget':'Monthly Budget': type != 'Saving'? 'Total In' : 'Target Saving'}
            </Text>
            <Text
              style={styles.priceLabel}
              category='h6'>
              ${type == 'Expense' ? budget : type != 'Saving'? totalIn : targetSaving}
              {/* <Text>{product.price.formattedScale}</Text> */}
            </Text>
          </View>
          <View>
            <Text
              style={styles.rentLabel}
              appearance='hint'
              category='p2'>
              {type == 'Expense' ? 'Today Expense': type != 'Saving'? 'Total Out' : 'Today Saving'}
            </Text>
            <Text
              style={styles.priceLabel}
              category='h6'>
              ${type == 'Expense' ? currExpense : type != 'Saving'? totalOut : currSaving}
              {/* <Text>{product.price.formattedScale}</Text> */}
            </Text>
          </View>

        </View>
        {/* <Button
          style={styles.bookButton}
          onPress={onBookButtonPress}>
          Transfer
        </Button> */}
        <Modal visible={visibleQR} backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)',}} onBackdropPress={()=>setVisibleQR(false)}>
        <Card disabled={true}>
          <Text category="h6" style={{textAlign: 'center',  marginBottom: 15}}>{name} QR</Text>
          <QRCode
          size={250}
          logo={{uri: base64Logo}}
          logoSize={60}
          logoBackgroundColor='transparent'
      value={`${idWallet}-${id}`}
     
    />
        </Card>
      </Modal>
      </Card >

    

{/* <View style={styles.profileButtonsContainer}>
          <Button
            style={styles.profileButton}
            accessoryLeft={PersonAddIcon}
            onPress={()=>{}}>
            Topup
          </Button>
          <View style={{width: 7}}/>
          <Button
            
            style={styles.profileButton}
            accessoryLeft={MessageCircleIcon}
            onPress={()=>{}}>
            Transfer
          </Button>
        </View> */}

  

      <Text
        style={[styles.sectionLabel, {marginTop: 16}]}
        category='s1'>
        Deals Recommendation
      </Text>
      <List
        style={{marginHorizontal: 8}}
        contentContainerStyle={styles.imagesList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={product.images}
        renderItem={renderCardServices}
      />
      <Text
        style={styles.sectionLabel}
        category='s1'>
        Recent Transaction
      </Text>
      <List
      style={{ maxHeight: 192, marginHorizontal: 16}}
      data={data}
      renderItem={renderItem}
    />
    </ScrollView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-2',
  },
  image: {
    height: 360,
  },
  bookingCard: {
    marginTop: -200,
    margin: 16,
  },
  title: {
    width: '65%',
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 0,
    marginHorizontal: 16
  },
  profileButton: {
    flex: 2,

  },
  rentLabel: {
    marginTop: 24,
  },
  priceLabel: {
    marginTop: 8,
  },
  bookButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  detailsList: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginVertical: 8,
  },
  detailItem: {
    marginHorizontal: 4,
    borderRadius: 16,
  },
  optionList: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginVertical: 8,
  },
  optionItem: {
    marginHorizontal: 4,
    paddingHorizontal: 0,
  },
  description: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionLabel: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  imagesList: {
    padding: 8,
    backgroundColor: 'background-basic-color-2',
  },
  imageItem: {
    width: 180,
    height: 120,
    borderRadius: 8
  },
});
