"use client";

// import { useTheme } from "next-themes";
import { GiSpikyExplosion } from "react-icons/gi";
// import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ['latin'] });

export function Header() {
  // const theme = useTheme();
  // const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";

  return (
    <div className="flex flex-col items-center gap-3 text-2xl md:text-3xl lg:text-4xl text-balance font-medium leading-tight tracking-tight mb-2">
      <div className="flex items-center gap-2 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-center">
          <GiSpikyExplosion className="h-8 w-8 bg-fuchsia-500 text-white p-1.5 rounded-md" />
        </div>
        <span className={`${instrumentSerif.className} font-light text-2xl text-fuchsia-400`}>
          supernova
        </span>
      </div>

      <h1 className="flex items-baseline gap-2 md:gap-3">
        <span className="py-1">Generate</span>
        <AuroraText className="font-medium italic py-1">
          stunning
        </AuroraText>
        <span className="font-medium py-1">UGC</span>
        {/* <LineShadowText
          className="font-medium"
          shadowColor={shadowColor}
        >
          UGC
        </LineShadowText> */}
        <span className="py-1">in minutes</span>
      </h1>
    </div>
  );
}
