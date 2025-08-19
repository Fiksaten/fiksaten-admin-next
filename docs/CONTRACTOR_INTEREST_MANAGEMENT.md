# Contractor Interest Management System

## Overview

The Contractor Interest Management System is a comprehensive solution for managing potential contractors who have expressed interest in joining the Fiksaten platform. This system provides tools for tracking contractor information, managing their status, assigning admin contacts, and sending targeted email communications.

## Features

### 1. Enhanced Contractor Information
- **Basic Details**: Name, email, phone number
- **Business Information**: Business ID, website URL
- **Status Tracking**: Waiting for response, interested, not interested, registered
- **Admin Assignment**: Assign specific admin users as contact persons
- **Notes**: Internal notes and comments about each contractor

### 2. Comprehensive Dashboard
- **Overview Tab**: Quick statistics and actions
- **Email Management Tab**: Advanced email campaign tools
- **Contractor Table Tab**: Detailed list view with filtering and sorting

### 3. Advanced Email Management
- **Email Templates**: Pre-built templates for common scenarios
- **Bulk Email Operations**: Send emails to multiple contractors at once
- **Email Status Tracking**: Monitor sent, failed, and pending emails
- **Retry Mechanism**: Automatically retry failed email deliveries

### 4. Admin Assignment System
- **Contact Person Assignment**: Assign specific admins to contractors
- **Workload Distribution**: Distribute contractor management across admin team
- **Accountability**: Track which admin is responsible for each contractor

## Database Schema

### New Fields Added

```sql
-- New fields in interestedContractors table
ALTER TABLE "interestedContractors" ADD COLUMN "businessId" text;
ALTER TABLE "interestedContractors" ADD COLUMN "website" text;
ALTER TABLE "interestedContractors" ADD COLUMN "status" "interestedContractorStatus" DEFAULT 'waitingForResponse' NOT NULL;
ALTER TABLE "interestedContractors" ADD COLUMN "assignedAdminId" uuid REFERENCES "users"("id") ON DELETE SET NULL;
```

### Status Enum Values

```typescript
export const interestedContractorStatus = pgEnum("interestedContractorStatus", [
  "waitingForResponse",  // Initial state when contractor is added
  "interested",          // Contractor has shown interest
  "notInterested",       // Contractor declined
  "registered",          // Contractor has completed registration
]);
```

## Components

### 1. ContractorInterestDashboard
Main dashboard component with three tabs:
- **Overview**: Quick stats and actions
- **Email Management**: Advanced email tools
- **Contractor Table**: Detailed data view

### 2. AddContractorDialog
Form for adding new contractors with all new fields:
- Name, email, phone (required)
- Business ID, website (optional)
- Status selection
- Admin assignment
- Notes

### 3. EditContractorDialog
Form for editing existing contractors with change tracking:
- Only sends updates for changed fields
- Resets email status when email changes
- Admin reassignment capabilities

### 4. ContractorInterestTable
Enhanced table view with:
- New columns for business details and status
- Status badges with color coding
- Admin assignment indicators
- Enhanced filtering and sorting

### 5. ContractorEmailManager
Comprehensive email management system:
- Email template selection
- Bulk email operations
- Contractor selection tools
- Email status tracking

## Usage Guide

### Adding a New Contractor

1. Navigate to the Contractor Interest Management page
2. Click "Add Contractor" button
3. Fill in the required fields (name, email)
4. Optionally add business details and assign an admin
5. Set initial status (defaults to "waitingForResponse")
6. Add any relevant notes
7. Click "Add Contractor"

### Managing Contractor Status

1. Open the contractor table view
2. Click the edit button for the desired contractor
3. Update the status field:
   - **waitingForResponse**: Initial state, ready for outreach
   - **interested**: Contractor has shown interest
   - **notInterested**: Contractor declined
   - **registered**: Contractor completed registration
4. Save changes

### Assigning Admin Contacts

1. In the add/edit contractor dialog
2. Use the "Assigned Admin" dropdown
3. Select from available admin users
4. This admin will be responsible for follow-up communications

### Sending Bulk Emails

1. Navigate to the Email Management tab
2. Select contractors using the checkboxes
3. Choose an email template or create custom content
4. Review the selected contractors
5. Click "Send to X Contractors"

### Email Templates

The system includes three default templates:

1. **Welcome Email**: Initial outreach to new contractors
2. **Follow-up Email**: For contractors who haven't responded
3. **Reminder Email**: Final reminder to complete registration

## API Endpoints

### Updated Endpoints

- `POST /admin/interested-contractors` - Create contractor with new fields
- `PUT /admin/interested-contractors/:id` - Update contractor with new fields
- `GET /admin/interested-contractors` - List contractors with new filters

### New Endpoints

- `GET /admin/users/admins` - Get list of admin users for assignment

## Filtering and Search

### Available Filters

- **Search**: Text search across name and email
- **Email Status**: sent, not_sent, failed
- **Business Status**: waitingForResponse, interested, notInterested, registered
- **Admin Assignment**: assigned, unassigned

### Sorting Options

- Newest first (default)
- Oldest first
- Name A-Z
- Email status priority
- Business status priority

## Email Management Features

### Email Status Tracking

- **Ready to Send**: Contractors who haven't received emails
- **Failed**: Emails that failed to send
- **Successfully Sent**: Confirmed email deliveries

### Bulk Operations

- Select multiple contractors by status
- Choose from email templates
- Custom email content creation
- Batch email sending with progress tracking

## Best Practices

### Contractor Management

1. **Regular Status Updates**: Keep contractor status current
2. **Admin Assignment**: Assign contractors to specific admins for accountability
3. **Notes**: Document all interactions and important information
4. **Follow-up**: Use the email system for consistent communication

### Email Campaigns

1. **Template Usage**: Start with pre-built templates
2. **Segmentation**: Target contractors by status and assignment
3. **Timing**: Space out follow-up emails appropriately
4. **Tracking**: Monitor email success rates and adjust strategies

### Data Quality

1. **Complete Information**: Fill in all available fields
2. **Status Accuracy**: Keep contractor status up to date
3. **Admin Assignment**: Ensure every contractor has a responsible admin
4. **Regular Review**: Periodically review and clean up data

## Future Enhancements

### Planned Features

1. **Email Analytics**: Track open rates, click-through rates
2. **Automated Workflows**: Trigger emails based on status changes
3. **Integration**: Connect with CRM systems
4. **Reporting**: Advanced analytics and reporting tools
5. **Mobile Support**: Mobile-optimized admin interface

### Email System Improvements

1. **Custom Templates**: Admin-created email templates
2. **A/B Testing**: Test different email approaches
3. **Scheduling**: Schedule emails for optimal timing
4. **Personalization**: Dynamic content based on contractor data

## Troubleshooting

### Common Issues

1. **Email Sending Failures**: Check contractor email validity and server logs
2. **Admin Assignment Issues**: Verify admin user exists and has proper permissions
3. **Status Update Problems**: Ensure database migrations are applied
4. **Filter Issues**: Check filter parameter values and database indexes

### Performance Considerations

1. **Large Contractor Lists**: Use pagination and filtering
2. **Email Operations**: Batch operations for large email campaigns
3. **Database Queries**: Ensure proper indexing on new fields
4. **Memory Usage**: Monitor component state management

## Security Considerations

1. **Admin Access**: Only admin users can access contractor data
2. **Data Privacy**: Contractor information is protected
3. **Email Security**: Secure email sending mechanisms
4. **Audit Trail**: Track all changes and operations

## Support

For technical support or questions about the Contractor Interest Management System:

1. Check this documentation first
2. Review the component code and types
3. Check database migration status
4. Contact the development team

---

*Last updated: [Current Date]*
*Version: 2.0.0*
