'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LandingCarouselProps {
  setCurrentSlide?: (index: number) => void;
  arrayOfYears: number[];
}

export default function LandingCarousel({ setCurrentSlide, arrayOfYears }: LandingCarouselProps) {
  const router = useRouter();

  const dataMessage =
  arrayOfYears && arrayOfYears.length > 0
    ? arrayOfYears[arrayOfYears.length - 1] === new Date().getFullYear()
      ? `The data is currently up to date — real-time information available as of ${new Date().getFullYear()}.`
      : `As of today, data is only available up to the year ${arrayOfYears[arrayOfYears.length - 1]}, since the source API has not been updated since then.`
    : null;

  return (
    <div className="flex flex-col items-center w-full h-full max-w-5xl">
      <Carousel className="w-full" setCurrentSlide={setCurrentSlide}>
        <CarouselContent>
          {/* Slide 1: Presentation */}
          <CarouselItem>
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <h1 className="text-6xl font-bold pt-12 pb-6">Car Accident Analysis Application</h1>
              <p className="text-2xl text-gray-600">Insurance Industry Analysis Purpose</p>
              <div className="flex-1 relative w-fit">
                <Image
                  src="/images/Presentation/CarCrashesPresentation.png"
                  alt="Presentation Image"
                  width={450}
                  height={300}           
                  />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 2: Data */}
          <CarouselItem>
            <div className="flex flex-col items-center h-full text-center gap-8 p-6">
              <h1 className="text-5xl font-bold text-gray-800 mb-6">Car Crashes (PoC) </h1>
              <p className="text-lg text-gray-600 mb-6">
                This is a <strong>Personal Project</strong> designed for companies in the{' '}
                <strong>Insurance Industry</strong>. It provides valuable insights for marketing
                teams to develop strategic decisions based on vehicle accidents <strong>real time data</strong> from the USA.
              </p>
              {dataMessage && (
                <p className="text-lg text-gray-700">
                  {dataMessage}
                </p>
              )}
            </div>
          </CarouselItem>

          {/* Slide 3: Problem & Solution */}
          <CarouselItem>
            <div className="flex flex-col h-full gap-8 p-6">
              <h2 className="text-5xl font-bold mb-6 self-center">Problem & Solution</h2>
              <p className="text-lg text-gray-700">
                <strong>Problems</strong> crafting an insurance marketing strategy for:
              </p>
              <ul className="text-lg text-gray-600 text- pl-6">
                <li>
                  - <strong className="underline">Positioning</strong> our insurance for automobile brands to recommend us to their
                  customers (B2B approach).
                </li>
                <li>
                  - <strong className="underline">Target personas</strong> independently from recommendations of automobile clients (B2C
                  approach).
                </li>
              </ul>
              <p className="text-lg text-gray-700">
                <strong>Solution:</strong> Implementation of a web application to showcase crucial real-time car
                crash data reported to the US government. To find a target audience (B2B & B2C) for
                car and life insurance.
              </p>
            </div>
          </CarouselItem>

          {/* Slide 4: Objective & Requirements */}
          <CarouselItem>
            <div className="flex flex-col h-full gap-6 p-6">
              <h2 className="text-5xl font-bold mb-8 self-center">Objective & Requirements</h2>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Objective:</strong> Create a visual representation of car fatal accidents data in the USA to identify a target
                audience for the B2B & B2C approach.
              </p>
              <p className="text-lg text-gray-700"><strong>Requirements:</strong></p>
              <ul className="text-lg text-gray-600 text-left pl-6 -mt-4">
                <li>- Read, understand and save legal government car crash data.</li>
                <li>- Generate targeted data based on states (B2C) and car brands/models (B2B)</li>
                <li>- Create a webpage to visualize the data in graphs</li>
                <li>- Showcase both on-premise and cloud infrastructures</li>
                <li>
                  - Demonstrate security methods to protect data privacy and address vulnerabilities
                </li>
              </ul>
            </div>
          </CarouselItem>

          {/* Slide 5: Architectures */}
          <CarouselItem>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-5xl font-bold">Architectures</h2>
              <div className="relative w-full max-w-4xl h-full overflow-hidden">
                <Image
                  src="/images/Presentation/Arquitecture.webp"
                  alt="Architecture Diagram"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 6: Technologies */}
          <CarouselItem>
            <div className="flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-5xl font-bold mb-4">Technologies</h2>
              <div className="grid grid-cols-2 gap-8 w-full max-w-5xl text-left">
                {/* Frontend Technologies */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-center">Frontend</h3>
                  <div className="flex flex-col gap-4">
                    {[
                      { name: 'next', desc: 'Framework for SSR and routing.' },
                      { name: 'react', desc: 'UI library for building interfaces.' },
                      { name: 'tailwind', desc: 'Utility-first CSS framework.' },
                      { name: 'typescript', desc: 'Typed JavaScript for safety and tooling.' },
                      { name: 'shadcn', desc: 'UI component library based on Radix + Tailwind.' },
                      { name: 'framermotion', desc: 'Animation library for React.' },
                      {
                        name: 'nivo',
                        desc: 'React charting library for data visualizations.',
                      },
                    ].map((tech) => (
                      <div key={tech.name} className="flex items-center gap-4">
                        <Image
                          src={`/images/Presentation/Technologies/${tech.name}.webp`}
                          alt={tech.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                        <p className="text-1sm text-gray-700">{tech.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend Technologies */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-center">Backend</h3>
                  <div className="flex flex-col gap-4">
                    {[
                      { name: 'java', desc: 'Main backend language.' },
                      { name: 'spring', desc: 'Framework for REST API and data handling.' },
                      { name: 'sqlite', desc: 'Lightweight relational database engine.' },
                      { name: 'jwt', desc: 'Authentication mechanism for stateless APIs.' },
                      { name: 'api', desc: 'API used from the gobernment of USA as source of the extraction part of the ETL arquitecture (NHTSA Crash Viewer API)' },
                    ].map((tech) => (
                      <div key={tech.name} className="flex items-center gap-4">
                        <Image
                          src={`/images/Presentation/Technologies/${tech.name}.webp`}
                          alt={tech.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                        <p className="text-1sm text-gray-700">{tech.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 7: Cloud Infrastructure */}
          <CarouselItem>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-5xl font-bold">Cloud-Based Infrastructure</h2>
              <div className="relative w-full max-w-4xl h-full overflow-hidden">
                <Image
                  src="/images/Presentation/CloudInfrastructure.webp"
                  alt="Cloud Infrastructure Diagram"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 8: On-Premise Infrastructure */}
          <CarouselItem>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-5xl font-bold">On-Premise Infrastructure</h2>
              <div className="relative w-full max-w-4xl h-full overflow-hidden">
                <Image
                  src="/images/Presentation/InfrastructurePremise.webp"
                  alt="On-Premise Infrastructure Diagram"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 9: Security Methods */}
          <CarouselItem>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-4xl font-bold mb-4">Security Methods Implemented</h2>
              <div className="relative w-full max-w-4xl h-full overflow-hidden">
                <Image
                  src="/images/Presentation/authentication.webp"
                  alt="Authentication Diagram"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 10: Real Deployment */}
          <CarouselItem>
            <div className="flex flex-col items-center justify-center h-full text-center gap-8">
              <h2 className="text-5xl font-bold mb-4">Real Deployment</h2>
              <p className="text-xl text-gray-700">
                Infrastructure deployed in an instance of EC2.
                <br />
                Budget-friendly using &apos;Free Trials&apos; 😄.
              </p>
              <div className="relative w-full max-w-4xl h-full overflow-hidden">
                <Image
                  src="/images/Presentation/FreeTrial.webp"
                  alt="Real Diagram"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 11: Thank you & GitHub */}
          <CarouselItem>
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
              <h2 className="text-5xl font-bold mb-10">Thanks for visiting my project!</h2>
              <p className="text-lg text-gray-600 max-w-xl">
                If you enjoyed exploring this project, feel free to <strong>visit the GitHub repository</strong> to
                check out the full code implementation.
              </p>
              <Link href="https://github.com/FabriDipolito/Poc-CarCrashes" target="_blank">
                <Button variant="default" size="lg" className='cursor-pointer'>
                  Visit GitHub Repository
                </Button>
              </Link>
              <p className="text-lg text-gray-600 max-w-xl mt-6">
                📝 If you have a moment, <strong>I would love to hear your feedback</strong> about the website and
                coding practices! Any suggestions are very welcome and help me improve.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer"
                onClick={() => {
                  router.push('/feedback');
                }}
              >
                Leave Feedback
              </Button>
            </div>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
