import { getServiceData, getAllServices } from "@/lib/services";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const services = getAllServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  try {
    const service = await getServiceData(params.slug);
    return {
      title: `${service.title} Services | Dhimahi Technolabs`,
      description: service.excerpt,
    };
  } catch {
    return {
      title: "Service Not Found",
    };
  }
}

export default async function ServicePage({ params }: Props) {
  let service;
  
  try {
    service = await getServiceData(params.slug);
  } catch {
    notFound();
  }

  return (
    <main className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/services" className="text-primary hover:underline">Services</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{service.title}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{service.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {service.excerpt}
          </p>
        </div>

        {/* Key Features */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">What We Offer</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <article 
          className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
          dangerouslySetInnerHTML={{ __html: service.content }}
        />

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's discuss how our {service.title.toLowerCase()} services can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/#contact-form"
              className="rounded-2xl bg-primary px-8 py-4 font-medium text-white shadow-soft hover:bg-primary-dark text-center"
            >
              Get Free Consultation
            </Link>
            <Link 
              href="/services"
              className="rounded-2xl border border-gray-300 px-8 py-4 font-medium hover:bg-gray-50 text-center"
            >
              View All Services
            </Link>
          </div>
        </div>

        {/* Back to Services */}
        <div className="mt-12 text-center">
          <Link href="/services" className="inline-flex items-center text-primary hover:underline">
            ← Back to all services
          </Link>
        </div>
      </div>
    </main>
  );
}