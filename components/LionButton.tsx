import { Button, ButtonProps } from 'react-native-paper'

export type LionButtonProps = ButtonProps

export default function LionButton(props: LionButtonProps) {
  return <Button rippleColor="rgba(255, 255, 255, 0.3)" {...props} />
}
