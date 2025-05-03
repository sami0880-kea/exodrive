import { Card, Text, Heading, Button, Inset } from "@radix-ui/themes";

interface CarCardProps {
  name: string;
  image: string;
  year: number;
  price: string;
}

const CarCard = ({ name, image, year, price }: CarCardProps) => {
  return (
    <Card size="1">
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src={image}
          alt={name}
          className="w-full h-[150px] md:h-[200px] object-cover"
        />
      </Inset>
      <div className="p-4 space-y-2">
        <Heading size="4" as="h3">
          {name}
        </Heading>
        <Text size="2" color="gray">
          {year}
        </Text>
        <Text size="3" weight="bold">
          {price}
        </Text>
      </div>
      <div>
        <Button className="w-full" variant="solid">
          Læs mere
        </Button>
      </div>
    </Card>
  );
};

export default CarCard;
