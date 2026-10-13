import { notFound } from "next/navigation";

import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Chip } from "@/shared/ui/Chip";
import { Input } from "@/shared/ui/Input";
import { Notice } from "@/shared/ui/Notice";
import { TokenChip } from "@/shared/ui/TokenChip";
import { Toast } from "@/shared/ui/Toast";

export const metadata = { title: "Компоненты", robots: { index: false, follow: false } };

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="mx-auto max-w-content space-y-8 px-5 py-8 lg:px-8">
      <h1 className="font-display text-display-s font-medium lg:text-heading">Компоненты</h1>
      <div className="flex flex-wrap gap-3">
        <Button>Основная</Button>
        <Button variant="ghost">Вторичная</Button>
        <Button disabled>Недоступна</Button>
        <Button loading>Загрузка</Button>
      </div>
      <Input placeholder="Поле" aria-label="Пример поля" />
      <div className="flex flex-wrap gap-2">
        <Chip onClick={() => undefined}>Гостиная</Chip>
        <Chip selected onClick={() => undefined}>
          Кухня
        </Chip>
      </div>
      <TokenChip balance={70} generationCost={30} />
      <TokenChip balance={10} generationCost={30} />
      <Notice title="Не хватает 20 токенов для генерации комнаты">На балансе 10, нужно 30.</Notice>
      <Toast variant="error">Не удалось сохранить</Toast>
      <Card>
        <Badge tone="green">Готово</Badge>
      </Card>
    </div>
  );
}
