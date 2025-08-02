# Logo Kurulum Kılavuzu

Bu kılavuz, Doralp web sitesinde logonuzu nasıl ekleyeceğinizi açıklar.

## Logo Dosyasını Ekleme

1. Logo dosyanızı `public` klasörüne koyun (örneğin: `public/logo.png`)
2. Logo dosyanızın formatı PNG, JPG, SVG olabilir
3. Önerilen boyutlar:
   - Navbar için: En az 120px genişlik, 48px yükseklik
   - Admin panel için: En az 100px genişlik, 40px yükseklik

## Logo URL'sini Güncelleme

### Ana Navbar'da Logo Değiştirme

`components/navbar.tsx` dosyasını açın ve 16. satırdaki `LOGO_URL` değişkenini güncelleyin:

```typescript
// Logo URL'sini buradan kolayca değiştirebilirsiniz
const LOGO_URL = "/logo.png" // Buraya kendi logo URL'nizi koyun
```

### Admin Panel'de Logo Değiştirme

`components/admin/admin-sidebar.tsx` dosyasını açın ve 77. satırdaki `LOGO_URL` değişkenini güncelleyin:

```typescript
// Logo URL'sini buradan kolayca değiştirebilirsiniz
const LOGO_URL = "/logo.png" // Buraya kendi logo URL'nizi koyun
```

## Örnek Kullanım

Eğer logonuz `public/doralp-logo.png` olarak kaydedilmişse:

```typescript
const LOGO_URL = "/doralp-logo.png"
```

Eğer logonuz bir URL'den geliyorsa:

```typescript
const LOGO_URL = "https://example.com/logo.png"
```

## Logo Boyutları

Logo boyutları otomatik olarak ayarlanır:
- **Navbar**: 48px yükseklik, 120px genişlik (maksimum)
- **Admin Sidebar**: 40px yükseklik, 100px genişlik (maksimum)

Logo dosyanız bu boyutlara uygun olarak ölçeklendirilir ve `object-contain` özelliği sayesinde oranları korunur.

## Notlar

- Logo değişikliği yapmadan önce dosyaları yedeklemeyi unutmayın
- Logo dosyanız büyükse, performans için optimize edilmiş bir versiyonunu kullanın
- Logo dosyanız transparan arka plana sahipse PNG formatını tercih edin