

## Add WhatsApp Contact Icon to Landing Page

Add a floating WhatsApp icon button to the landing page that allows customers to directly message the provided number (9373387800).

### Implementation

1. **Create WhatsApp button component** (`src/components/WhatsAppButton.tsx`)
   - Floating button fixed to bottom-right of screen
   - Green WhatsApp brand color with white icon
   - Link to `https://wa.me/919373387800` (pre-filled chat)
   - Hover effect with scale animation

2. **Update Index.tsx** to include the WhatsApp button

### Design Details

- Icon: WhatsApp icon (from lucide-react or custom SVG)
- Position: Fixed bottom-right, 24px from edges
- Style: Green circular button (#25D366) with shadow
- Mobile-friendly: Slightly smaller on mobile, doesn't overlap with footer

