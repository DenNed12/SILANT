import { Card, StatCard } from '../components/ui/Card';

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Панель управления</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Машины"
          value={42}
          icon="🚜"
          link="/machines"
        />
        {/* Другие StatCard */}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card title="Последние ТО">
          {/* Контент карточки */}
        </Card>
      </div>
    </div>
  );
}