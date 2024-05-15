import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient( withFetch() )
  ]
};
/* Провайдери сервісів - інструменти, які дозволяють повторно використовувати
складні об'єкти в різних компонентах (та інших ділянках коду).
Ідея полягає в тому, що об'єкт (наприклад, HttpClient) буде створено
і налаштовано один раз, а всі, кому цей об'єкт потрібен, будуть його
інжектувати (див. currency-rates...ts)
*/