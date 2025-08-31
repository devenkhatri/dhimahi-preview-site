import { NextRequest, NextResponse } from 'next/server';
import { submitFormData, calculateLeadScore, getEmailTemplate, FormSubmission } from '@/lib/form-integrations';

export async function POST(request: NextRequest) {
  try {
    const data: FormSubmission = await request.json();

    // Validate required fields
    if (!data.email || !data.formType) {
      return NextResponse.json(
        { error: 'Email and form type are required' },
        { status: 400 }
      );
    }

    // Add server-side data
    const enrichedData: FormSubmission = {
      ...data,
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      referer: request.headers.get('referer') || '',
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown'
    };

    // Calculate lead score
    const leadScore = calculateLeadScore(enrichedData);
    enrichedData.leadScore = leadScore;

    // Submit to all configured integrations
    await submitFormData(enrichedData);

    // Send notification email (if configured)
    if (process.env.NOTIFICATION_EMAIL) {
      try {
        const emailTemplate = getEmailTemplate(data.formType, enrichedData);
        
        // Here you would integrate with your email service
        // For example, using SendGrid, Mailgun, or AWS SES
        console.log('Email notification:', {
          to: process.env.NOTIFICATION_EMAIL,
          subject: emailTemplate.subject,
          leadScore,
          formType: data.formType
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      leadScore,
      formType: data.formType
    });

  } catch (error) {
    console.error('Form submission error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit form',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}