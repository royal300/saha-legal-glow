import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BookAppointment = () => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    caseType: "",
    caseDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Please select an appointment date");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.mobile || !formData.caseType) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const appointmentData = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        caseType: formData.caseType,
        caseDetails: formData.caseDetails,
        appointmentDate: date.toLocaleDateString('en-IN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
      };

      const { error } = await supabase.functions.invoke('send-appointment-email', {
        body: appointmentData,
      });

      if (error) {
        console.error("Email error:", error);
        throw error;
      }

      setIsSubmitted(true);
      toast.success("Appointment booked successfully!");

      // Reset form
      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          caseType: "",
          caseDetails: "",
        });
        setDate(undefined);
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Appointment booking error:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 pt-20">
        <div className="text-center max-w-md animate-scale-in">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-playfair font-bold text-navy mb-4">
            Thank You for Booking!
          </h1>
          <p className="text-muted-foreground text-lg">
            We have received your appointment request and will get in touch with you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-4">
            Book Your Appointment
          </h1>
          <p className="text-muted-foreground text-lg">
            Schedule a consultation with Advocate Rajkumar Saha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-elegant p-8 md:p-12 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Calendar */}
            <div>
              <Label className="text-navy font-semibold mb-3 block">
                Select Appointment Date *
              </Label>
              <div className="border rounded-lg p-4 bg-muted/30">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date < new Date() || date.getDay() === 0
                  }
                  className="pointer-events-auto"
                />
              </div>
              {date && (
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-2 text-golden" />
                  Selected: {format(date, "PPP")}
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-navy font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-navy font-semibold">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="text-navy font-semibold">
                  Mobile Number *
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  placeholder="+91 XXXXXXXXXX"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="caseType" className="text-navy font-semibold">
                  Case Type *
                </Label>
                <Select
                  value={formData.caseType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, caseType: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="criminal">Criminal Law</SelectItem>
                    <SelectItem value="civil">Civil Law</SelectItem>
                    <SelectItem value="family">Family Disputes</SelectItem>
                    <SelectItem value="corporate">Corporate Law</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="mb-8">
            <Label htmlFor="caseDetails" className="text-navy font-semibold">
              Case Details
            </Label>
            <Textarea
              id="caseDetails"
              value={formData.caseDetails}
              onChange={(e) =>
                setFormData({ ...formData, caseDetails: e.target.value })
              }
              placeholder="Please provide details about your case..."
              rows={6}
              className="mt-2"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-golden text-lg py-6"
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
