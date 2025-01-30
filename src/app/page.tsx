import { generateUserToken } from "@/src/actions";
import { CrystalBall } from "@/src/app/Components/CrystalBall";
import { AudioProvider } from "@/src/app/Components/AudioProvider";

export default async function Home() {
  const usageToken = await generateUserToken();
  
  return (
    <AudioProvider>
      <div 
        className="fixed inset-0 w-full h-full flex items-center justify-center"
        style={{
          backgroundImage: 'url("/background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        
        <div className="flex flex-col items-center justify-center space-y-8 z-10">
          <CrystalBall usageToken={usageToken.token} />
          
          <div className="text-purple-300 font-mystical text-xl">
            <a href="tel:+1234567890" className="hover:text-purple-400 transition-colors">
              Call: +1 (805) 439 8596
            </a>
          </div>
        </div>
      </div>
    </AudioProvider>
  );
}
