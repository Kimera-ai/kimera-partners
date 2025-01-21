import { DotPattern } from "@/components/ui/dot-pattern"

export const AuthBackground = () => (
  <>
    <div className="fixed inset-0 bg-gradient-to-br from-background via-[#222222] to-[#9F9EA1]/5" />
    <div className="fixed inset-0 pointer-events-none">
      <DotPattern
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
        className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
      />
    </div>
  </>
)