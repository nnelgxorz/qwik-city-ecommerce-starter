export interface RestaurantLocation {
  id: string
  name: string
  address: {
    street: string
    city: string
  }
}

const createLocation = (name: string, id: string): RestaurantLocation => {
  return {
    id,
    name,
    address: {
      street: `${id} Fake Street`,
      city: name
    }
  }
}

export const LOCATIONS: RestaurantLocation[] = [
  createLocation("Partytown", "123"),
  createLocation("Qwik City", "456"),
  createLocation("Proxytown", "789")
]