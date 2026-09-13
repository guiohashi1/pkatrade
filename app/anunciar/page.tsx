import { CreateAdForm } from "@/components/CreateAdForm";
import { RequireAuth } from "@/components/RequireAuth";

export default function AnunciarPage() {
  return (
    <RequireAuth requireProfile>
      <div className="px-3 py-5 sm:px-6 sm:py-7">
        <CreateAdForm />
      </div>
    </RequireAuth>
  );
}
