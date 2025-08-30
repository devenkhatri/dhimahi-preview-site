import { PricingTier } from '@/lib/services';

interface PricingTiersProps {
  tiers: PricingTier[];
  serviceName: string;
}

export default function PricingTiers({ tiers, serviceName }: PricingTiersProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 mb-12">
      <h2 className="text-2xl font-bold text-center mb-2">Investment Options</h2>
      <p className="text-gray-600 text-center mb-8">
        Choose the {serviceName.toLowerCase()} package that best fits your business needs
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier, index) => (
          <div 
            key={index}
            className={`relative rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg ${
              tier.popular 
                ? 'border-primary bg-white shadow-lg scale-105' 
                : 'border-gray-200 bg-white hover:border-primary'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-primary mb-1">{tier.price}</div>
              <div className="text-gray-600 text-sm">{tier.duration}</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
              tier.popular
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'border border-primary text-primary hover:bg-primary hover:text-white'
            }`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-600 text-sm mb-4">
          All packages include free consultation and 30-day support
        </p>
        <button className="text-primary font-medium hover:underline">
          Need a custom solution? Contact us →
        </button>
      </div>
    </div>
  );
}