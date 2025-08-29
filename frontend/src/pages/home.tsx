import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-12 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
            Excellence in Education,
            <br />
            Foundation for the Future.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover a world of knowledge and opportunity at Greenfield University. We are committed to fostering
            innovation, critical thinking, and a passion for lifelong learning.
          </p>
          <div className="flex flex-col sm:flex-row pt-8 justify-center items-center">
            <Button
              variant="secondary"
              size="lg"
              className="px-8 text-base"
              onClick={() => {
                window.location.href = "/student/sign-in";
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Greenfield Section */}
      <section className="px-2 sm:px-4 py-10 md:py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Greenfield?</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide a supportive and intellectually stimulating environment where students can thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-none bg-background/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">World-Class Faculty</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Learn from experts and leaders in their respective fields.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-background/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">State-of-the-Art Facilities</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Access modern labs, libraries, and resources for your academic journey.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-background/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">Vibrant Campus Life</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Engage in a diverse community with numerous clubs and activities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}