import { Container } from '@mui/material';
import UploadDropzone from '../../features/drawing-upload/components/UploadDropzone';

export default function UploadPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <UploadDropzone />
    </Container>
  );
}
