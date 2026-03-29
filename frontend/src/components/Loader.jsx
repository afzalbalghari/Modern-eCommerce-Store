export default function Loader({ size = "md", text = "" }) {
    const sizes = { sm: "w-5 h-5 border-2", md: "w-8 h-8 border-2", lg: "w-12 h-12 border-3" };
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className={`${sizes[size]} rounded-full border-[#e2e5ea] border-t-[#0f4c81] animate-spin`} />
        {text && <p className="text-sm text-[#475569]">{text}</p>}
      </div>
    );
  }
  
  export function SkeletonCard() {
    return (
      <div className="bg-white rounded-xl border border-[#e2e5ea] overflow-hidden animate-pulse">
        <div className="aspect-[4/3] bg-[#f1f5f9]" />
        <div className="p-4 space-y-2">
          <div className="h-3 bg-[#f1f5f9] rounded w-1/3" />
          <div className="h-4 bg-[#f1f5f9] rounded w-4/5" />
          <div className="h-4 bg-[#f1f5f9] rounded w-3/5" />
          <div className="flex justify-between mt-3">
            <div className="h-5 bg-[#f1f5f9] rounded w-1/4" />
            <div className="h-8 bg-[#f1f5f9] rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }