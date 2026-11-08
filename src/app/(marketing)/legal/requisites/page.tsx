import { legalEntity } from "@/shared/config/legalEntity";
import { LegalProse } from "@/shared/ui/LegalProse";

export const metadata = { title: "Реквизиты ИП" };

export default function RequisitesPage() {
  return (
    <LegalProse>
      <h1>Реквизиты ИП</h1>
      <p>
        Оператор сервиса «{legalEntity.brandName}» ({legalEntity.productName}) —{" "}
        {legalEntity.ipShortName}.
      </p>

      <section aria-labelledby="requisites-main">
        <h2 id="requisites-main">Регистрационные данные</h2>
        <dl className="space-y-3 [&_dt]:font-medium [&_dt]:text-ink [&_dd]:mt-1">
          <div>
            <dt>Наименование</dt>
            <dd>{legalEntity.ipFullName}</dd>
          </div>
          <div>
            <dt>ИНН</dt>
            <dd>{legalEntity.inn}</dd>
          </div>
          <div>
            <dt>ОГРНИП</dt>
            <dd>{legalEntity.ogrnip}</dd>
          </div>
          <div>
            <dt>Дата регистрации</dt>
            <dd>{legalEntity.registrationDate}</dd>
          </div>
          <div>
            <dt>Основной вид деятельности (ОКВЭД)</dt>
            <dd>{legalEntity.okvedMain}</dd>
          </div>
          <div>
            <dt>Регион регистрации</dt>
            <dd>{legalEntity.region}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="requisites-contacts">
        <h2 id="requisites-contacts">Контакты</h2>
        <dl className="space-y-3 [&_dt]:font-medium [&_dt]:text-ink [&_dd]:mt-1">
          <div>
            <dt>Сайт</dt>
            <dd>
              <a href={legalEntity.siteUrl} className="text-ink underline-offset-2 hover:underline">
                {legalEntity.siteUrl}
              </a>
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a
                href={`mailto:${legalEntity.email}`}
                className="text-ink underline-offset-2 hover:underline"
              >
                {legalEntity.email}
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <p className="text-caption text-ink-tertiary">
        Безналичная оплата услуг на сайте принимается через платёжного партнёра (ЮKassa). Чек
        направляется на email, указанный при оплате.
      </p>
    </LegalProse>
  );
}
