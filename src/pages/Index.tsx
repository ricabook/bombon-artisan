import Header from "@/components/Header";
import CustomizationPanel from "@/components/CustomizationPanel";
import PreviewArea from "@/components/PreviewArea";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Customization Panel */}
          <div className="order-2 lg:order-1">
            <CustomizationPanel />
          </div>
          
          {/* Right Column - Preview Area */}
          <div className="order-1 lg:order-2">
            <PreviewArea />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
