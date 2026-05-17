import { test as base } from '@playwright/test';

export type TestOptions = {
    petOwner: {
        ownerFirstName: string
        ownerLastName: string
        petName: string
        visitDescription: string
    }
}

export const test = base.extend<TestOptions>({
    petOwner: async ({ page, request }, use) => {
        const ownerFirstName = "Kamila"
        const ownerLastName = "Greenwood"
        const newOwnerResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners', {
            data: {
                address: "290 Bremner Blvd",
                city: "Toronto",
                firstName: ownerFirstName,
                id: null,
                lastName: ownerLastName,
                telephone: "1236494827"
            }
        })
        const newOwnerId = (await newOwnerResponse.json()).id
        const petTypesResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/pettypes')
        const petTypesJson = await petTypesResponse.json()
        const birdTypeId = petTypesJson.find((item: { name: string }) => item.name === 'bird').id
        const petName = "Milly"
        const newPetResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}/pets`, {
            data: {
                id: null,
                owner: {
                    firstName: ownerFirstName,
                    lastName: ownerLastName,
                    address: "290 Bremner Blvd",
                    city: "Toronto",
                    telephone: "1236494827",
                    id: newOwnerId,
                    pets: []
                },
                name: petName,
                birthDate: "2026-02-01",
                pettype: "bird",
                type: {
                    name: "bird",
                    id: birdTypeId
                }
            }
        })
        const newPetId = (await newPetResponse.json()).id
        const visitDescription = "Initial check-up"
        await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}/pets/${newPetId}/visits`, {
            data: {
                date: "2026-05-14",
                description: visitDescription,
                id: null,
                pet: {
                    name: petName,
                    birthDate: "2026-02-01",
                    type: {
                        name: "bird",
                        id: birdTypeId
                    },
                    id: newPetId,
                    ownerId: newOwnerId,
                    visits: []
                }
            }
        })
        await use({ ownerFirstName, ownerLastName, petName, visitDescription })

        //teardown: deleting owner
        await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}`)
    }
})
