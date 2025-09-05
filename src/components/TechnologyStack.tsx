import { TechnologyStack } from '@/lib/cms-content';

interface TechnologyStackProps {
  stack: TechnologyStack[];
  serviceName: string;
}

export default function TechnologyStackComponent({ stack, serviceName }: TechnologyStackProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-2">Technology Stack</h2>
      <p className="text-gray-600 text-center mb-8">
        Modern, reliable technologies we use for {serviceName.toLowerCase()} projects
      </p>
      
      <div className="space-y-8">
        {stack.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">{category.category}</h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.technologies.map((tech, techIndex) => (
                <div 
                  key={techIndex}
                  className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {tech.icon && (
                    <div className="text-2xl flex-shrink-0">{tech.icon}</div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{tech.name}</h4>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Always Up-to-Date</h3>
          <p className="mb-4">
            We continuously evaluate and adopt the latest technologies to ensure your project uses the best tools available
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Latest Versions</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Security Updates</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Performance Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
}