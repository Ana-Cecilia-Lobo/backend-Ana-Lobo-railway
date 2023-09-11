
const addToCart = async (productId) => {
	try {
		const resp = await fetch(
			`https://backend-ana-lobo-railway-production.up.railway.app/user-cart`,
			{
				method: "get",
			}
		);

		const cartId = await resp.json();
		
		
		if (productId && cartId) {
			const resp = await fetch(
				`https://backend-ana-lobo-railway-production.up.railway.app/api/carts/${cartId}/product/${productId}`,
				{
					method: "POST",
				}
			);
			const result = await resp.json();
			console.log(result)
			
			if (result.status == "success") {
				const payload = await fetch(
					`https://backend-ana-lobo-railway-production.up.railway.app/api/carts/${cartId}`,
					{
						method: "GET",
					}
				);
				const cart = await payload.json();
				console.log(cart.data);
			}
		}
	} catch (error) {
		console.log("Error: ", error.message);
	}
}


const cart = async ()=>{
	try {
		const resp = await fetch(
			`https://backend-ana-lobo-railway-production.up.railway.app/user-cart`,
			{
				method: "GET",
			}
		);

		const cartId = await resp.json();

		const res = 
		(window.location.href = `https://backend-ana-lobo-railway-production.up.railway.app/carts/${cartId}`)
		
		
		

	} catch (error) {
		console.log(error.message)
	}
}
