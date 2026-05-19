import React from 'react';
// Import semua 15 komponen (Sesuaikan path jika berbeda)
import Button from '../components/Button';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import Logo from '../components/Logo';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import SupplyProgress from '../components/SupplyProgress';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import Checkbox from '../components/Checkbox';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { Home, User, Mail, ShieldAlert } from 'lucide-react';

export default function Components() {
  return (
    <div className="p-8 pb-24 font-poppins animate-fade-in">
      <PageHeader title="UI Components Playground" subtitle="Katalog 15 Komponen Reusable FreshLaundry" />

      <div className="space-y-12">
        {/* 1. BASIC COMPONENTS */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">1. Basic Components</h2>
          <div className="flex flex-wrap gap-6 items-end">
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Button</p>
              <div className="flex gap-2">
                <Button type="primary">Primary</Button>
                <Button type="secondary">Secondary</Button>
                <Button type="danger">Danger</Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Badge</p>
              <div className="flex gap-2">
                <Badge status="Menunggu" />
                <Badge status="Diproses" />
                <Badge status="Selesai" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Avatar & Logo</p>
              <div className="flex items-center gap-4">
                <Avatar name="Dzakwan" />
                <Avatar src="https://avatar.iran.liara.run/public/boy" />
                <Logo size="text-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. LAYOUT COMPONENTS */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">2. Layout Components</h2>
          <p className="text-xs text-gray-500 mb-2">Card & Page Header (SidebarLink dites di menu kiri)</p>
          <Card className="bg-gray-50">
            <p className="text-gray-600 text-sm">Ini adalah konten di dalam Card komponen.</p>
          </Card>
        </section>

        {/* 3. DATA DISPLAY COMPONENTS */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">3. Data Display Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Pendapatan" value="Rp 2.500.000" icon={Home} colorClass="bg-blue-100 text-blue-600" />
            <Card>
              <SupplyProgress name="Deterjen" amount="5" unit="Liter" progress={60} color="bg-blue-500" />
              <SupplyProgress name="Pewangi" amount="1" unit="Jerigen" progress={15} color="bg-red-500" />
            </Card>
          </div>
          <div className="mt-6">
            <Table headers={["No", "Layanan", "Aksi"]}>
              <tr className="border-b border-gray-50">
                <td className="p-4">1</td>
                <td className="p-4 font-bold text-gray-800">Cuci Komplit</td>
                <td className="p-4"><Button type="secondary">Edit</Button></td>
              </tr>
            </Table>
          </div>
        </section>

        {/* 4. FORM COMPONENTS */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">4. Form Components</h2>
          <div className="max-w-md space-y-4">
            <InputField label="Email Address" icon={Mail} placeholder="Masukkan email..." />
            <PasswordField label="Password" placeholder="Masukkan sandi rahasia..." />
            <Checkbox id="check1" label="Saya setuju dengan syarat & ketentuan" />
          </div>
        </section>

        {/* 5. FEEDBACK COMPONENTS */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">5. Feedback Components</h2>
          <div className="space-y-4 max-w-md">
            <Alert type="success" message="Data berhasil disimpan!" />
            <Alert type="error" message="Gagal menghubungi server database." />
            <div className="border border-dashed border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500 text-center mb-2">Loading Spinner</p>
              <LoadingSpinner />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}