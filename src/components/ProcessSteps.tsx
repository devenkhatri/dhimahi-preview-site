import { ProcessStep } from '@/lib/services';

interface ProcessStepsProps {
  steps: ProcessStep[];
  serviceName: string;
}

export default function ProcessSteps({ steps, serviceName }: ProcessStepsProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-2">Our {serviceName} Process</h2>
      <p className="text-gray-600 text-center mb-8">
        A proven methodology that ensures successful project delivery
      </p>
      
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connection line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200 z-0"></div>
            )}
            
            <div className="flex items-start space-x-6">
              {/* Step number */}
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                {step.step}
              </div>
              
              {/* Step content */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <h3 className="text-xl font-bold mb-2 md:mb-0">{step.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      ⏱️ {step.duration}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{step.description}</p>
                
                {step.deliverables && step.deliverables.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Deliverables:</h4>
                    <ul className="grid gap-2 md:grid-cols-2">
                      {step.deliverables.map((deliverable, deliverableIndex) => (
                        <li key={deliverableIndex} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8 bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-2">Ready to Start Your Project?</h3>
        <p className="text-gray-600 mb-4">
          Our structured approach ensures transparency and quality at every step
        </p>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors">
          Schedule Free Consultation
        </button>
      </div>
    </div>
  );
}